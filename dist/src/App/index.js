"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cluster = require("cluster");
const os_1 = require("os");
const path_1 = require("path");
const pkg = require("package.json");
const Constants_1 = require("@/Config/Constants");
const Utils_1 = require("@/App/Utils");
const Config_1 = require("@/Config");
const Tools_1 = require("@/Tools");
const coreLog = Tools_1.Console('[Core]');
if (Cluster.isMaster) {
    const execArgv = ['-r', 'tsconfig-paths/register', '-r', 'ts-node/register'];
    const exec = path_1.join(`${__dirname}/Shard.ts`);
    Cluster.setupMaster({ execArgv, exec });
}
const getPureArguments = () => {
    const PureArguments = new Map();
    process.argv.splice(0, 2);
    process.argv
        .filter(arg => arg.match(/^-(!-)/))
        .forEach(arg => {
        process.argv.splice(process.argv.indexOf(arg, 1), 1);
        PureArguments.set(arg.slice(1), true);
    });
    process.argv
        .filter(arg => arg.includes('--'))
        .forEach((_, i) => PureArguments.set(process.argv[i * 2].slice(2), process.argv[++i * 2 - 1]));
    return PureArguments;
};
const getClusters = () => {
    const MAX_WORKERS = +process.env.NUMBER_OF_PROCESSORS || os_1.cpus().length;
    if (exports.argv.has('enable-clusters')) {
        if (exports.argv.has('clusters')) {
            const clusters = exports.argv.get('clusters');
            if (clusters === 'auto') {
                return MAX_WORKERS;
            }
            else if (typeof clusters === 'number') {
                return +clusters;
            }
            coreLog.error('invalid arguments');
            process.exit(9);
        }
        return MAX_WORKERS;
    }
    else if (Constants_1.default.useCluster) {
        if (!!Constants_1.default.Clusters) {
            return +Constants_1.default.Clusters;
        }
        return MAX_WORKERS;
    }
    return 1;
};
exports.argv = getPureArguments();
exports.numClusters = getClusters();
exports.App = {
    start() {
        const commonInfo = `${Constants_1.default.botName} v${pkg.version}`;
        coreLog.log(`Start ${commonInfo}`);
        coreLog.log(exports.argv);
        Utils_1.Process.setTitle(commonInfo);
        Config_1.Config.initialise();
        exports.App.initCluster();
        exports.App.bindEvent();
        exports.App.bindClusterEvent();
        process.emit(3);
    },
    broadcast({ cmd }) {
        for (const pid in Cluster.workers) {
            Cluster.workers[pid].send(cmd);
        }
    },
    initCluster() {
        coreLog.log('Initialise the shards');
        for (let clusterID = 0; clusterID < exports.numClusters; clusterID++) {
            const clusterEnv = { SHARD_ID: clusterID, SHARD_COUNT: exports.numClusters };
            Cluster.fork(clusterEnv);
        }
    },
    bindClusterEvent() {
        Cluster.on('online', Worker => {
            coreLog.log(`Cluster [PID: ${Worker.process.pid}] has started.`);
        });
        Cluster.on('exit', (Worker, Code) => {
            if (Code === 0)
                return;
            coreLog.log(`Cluster [PID: ${Worker.process.pid}] has been shutdown abnormally.`);
        });
    },
    bindEvent() {
        process.on('uncaughtException', Error => coreLog.error(Error.stack));
        process.on('unhandledRejection', (reason, position) => {
            coreLog.error(`Occured unhandled rejection at: ${position} because of ${reason}`);
        });
        process.on(2, exports.App.broadcast);
        process.on(9, exports.App.shutdown);
        process.on(8, exports.App.shutdown);
        process.once('SIGTERM', exports.App.shutdown);
        process.once('SIGINT', exports.App.shutdown);
        process.once('SIGUSR1', exports.App.shutdown);
        process.once('SIGUSR2', exports.App.shutdown);
    },
    shutdown() {
        for (const pid in Cluster.workers) {
            try {
                Cluster.workers[pid].destroy();
            }
            catch (err) {
                coreLog.error(err);
            }
        }
        coreLog.log('Received shutdown signal');
        process.exit(0);
    }
};
