"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path_1 = require("path");
const dotEnv = require("dotenv");
const App_1 = require("@/App");
const Tools_1 = require("@/Tools");
const envPath = 'src/Config/.env';
const validEnvName = 'development' || 'production' || 'test' || 'debug';
const configLog = Tools_1.Console('[Config]');
exports.Config = {
    initialise() {
        if (!process.env.NODE_ENV) {
            if (!App_1.argv.has('env')) {
                configLog.warn("Could not found 'NODE_ENV' in environment variable or cli argument");
            }
            else {
                const env = App_1.argv.get('env');
                if (env !== validEnvName) {
                    configLog.warn('Unkown Node_ENV detected in cli argument. ' +
                        'This can cause unexpected problems in the future');
                }
            }
        }
        if (fs.existsSync(envPath)) {
            const parsedEnv = dotEnv.config({
                path: path_1.resolve('src/Config/.env')
            });
            if (parsedEnv.error) {
                throw new Error('Failed to parse env file');
            }
            process.env = parsedEnv.parsed;
            process.env.NODE_ENV =
                process.env.NODE_ENV ||
                    (App_1.argv.has('env') ? App_1.argv.get('env') : 'development');
            configLog.debug(process.env);
        }
        else {
            configLog.error('Could not found env file');
            throw new Error('Could not found env file');
        }
    }
};
