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
const execArgv = ['-r', 'tsconfig-paths/register', '-r', 'ts-node/register'];
const exec = path_1.join(`${__dirname}/Shard.ts`);
Cluster.setupMaster({ execArgv, exec });
const broadcast = async ({ cmd }) => {
    for (const pid in Cluster.workers) {
        await Cluster.workers[pid].send(cmd);
    }
};
const getPureArguments = () => {
    const PureArguments = new Map();
    process.argv.splice(0, 2);
    process.argv
        .filter(arg => arg.match(/^-(?!-)/))
        .map(arg => {
        process.argv.splice(process.argv.indexOf(arg, 1), 1);
        PureArguments.set(arg.slice(1), true);
    });
    process.argv
        .filter(arg => arg.includes('--'))
        .map((_, i) => PureArguments.set(process.argv[i * 2].slice(2), process.argv[++i * 2 - 1]));
    return PureArguments;
};
const getClusters = () => {
    const MAX_WORKERS = os_1.cpus().length;
    if (argv.has('enable-clusters')) {
        if (argv.has('clusters')) {
            const clusters = argv.get('clusters');
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
const getRedis = () => new Map();
const argv = getPureArguments();
class App {
}
App.argv = argv;
App.numClusters = getClusters();
App.Redis = getRedis();
App.closedClusters = 0;
App.start = () => {
    const commonInfo = `${Constants_1.default.botName} v${pkg.version}`;
    coreLog.log(`Start ${commonInfo}`);
    coreLog.log(App.argv);
    Utils_1.Process.setTitle(commonInfo);
    Config_1.Config.initialise();
    App.initCluster();
    App.bindClusterEvent();
    App.bindEvent();
    process.emit(3);
};
App.initCluster = () => {
    coreLog.log('Initialise the shards');
    for (let clusterID = 0; clusterID < App.numClusters; clusterID++) {
        const clusterEnv = { SHARD_ID: clusterID, SHARD_COUNT: App.numClusters };
        Cluster.fork(clusterEnv);
    }
};
App.bindClusterEvent = () => {
    Cluster.on('online', Worker => {
        coreLog.log(`Cluster [PID: ${Worker.process.pid}] has started.`);
    });
    Cluster.on('exit', (Worker, Code, Signal) => {
        if (Code === 0)
            return;
        coreLog.log(`Cluster [PID: ${Worker.process.pid}] has been shutdown abnormally. Received ${Signal} signal.`);
    });
};
App.bindEvent = () => {
    process.on('uncaughtException', async (Error) => coreLog.error(Error.stack));
    process.on('unhandledRejection', (reason, position) => {
        coreLog.error(`Occured unhandled rejection at: ${position} because of ${reason}`);
        broadcast({ cmd: 8 });
    });
    process.stdin.resume();
    process.on('SIGTERM', () => broadcast({ cmd: 9 }));
    process.on('SIGINT', () => broadcast({ cmd: 9 }));
    process.on('SIGUSR1', () => broadcast({ cmd: 9 }));
    process.on('SIGUSR2', () => broadcast({ cmd: 9 }));
    process.on(2, broadcast);
    process.on(12, () => broadcast({ cmd: 12 }));
    process.on(13, () => broadcast({ cmd: 13 }));
    process.on(14, () => broadcast({ cmd: 14 }));
    process.on(9, App.harmonyExit);
    process.on(8, App.harmonyExit);
};
App.harmonyExit = () => {
    ++App.closedClusters;
    if (App.closedClusters >= App.numClusters) {
        coreLog.log('Master app is closing in harmony');
        process.exit(0);
    }
};
exports.App = App;
