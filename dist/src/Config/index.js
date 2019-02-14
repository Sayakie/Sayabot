"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path_1 = require("path");
const dotEnv = require("dotenv");
const App_1 = require("@/App");
const Tools_1 = require("@/Tools");
const configLog = Tools_1.Console('[Config]');
const getEnvPath = (env) => `src/Config/${env}.env`;
const ConfigFile = 'src/Config/Config.json';
exports.Config = {
    initialise() {
        exports.Config.createConfigIfNotExists();
        exports.Config.setProcessEnviroment();
    },
    createConfigIfNotExists() {
        const isExists = fs.existsSync(path_1.resolve(ConfigFile));
        if (!isExists) {
            const defaultOptions = {
                token: 'your token'
            };
            fs.writeFileSync(path_1.resolve(ConfigFile), JSON.stringify(defaultOptions, null, 2), {
                encoding: 'utf-8'
            });
            configLog.log('Configuration file not found. ' +
                "'Config.json' files is created at src/Config. " +
                'Modify that to yours and then restart me');
        }
    },
    setProcessEnviroment() {
        if (!process.env.NODE_ENV) {
            if (!App_1.App.argv.has('env')) {
                exports.Config.setFullEnviroment('development');
                configLog.warn('NODE_ENV could not found at enviroment path or cli arguments!');
                configLog.warn("Automatically NODE_ENV set to 'development'");
            }
            else {
                const env = App_1.App.argv.get('env');
                if (env !== ('development' || 'production')) {
                    configLog.warn('Unknown NODE_ENV detected at cli arguments. ' +
                        'This can cause unexpected problems in the future');
                }
                exports.Config.setFullEnviroment(env);
            }
        }
        else {
            exports.Config.setFullEnviroment(process.env.NODE_ENV);
        }
    },
    setFullEnviroment(envPath) {
        process.env = dotEnv.config({ path: path_1.resolve(getEnvPath(envPath)) }).parsed;
        process.env.NODE_ENV = envPath;
    }
};
