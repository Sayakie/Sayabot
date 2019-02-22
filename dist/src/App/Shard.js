"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Discord = require("discord.js");
const path_1 = require("path");
const pkg = require("package.json");
const Constants_1 = require("@/Config/Constants");
const Utils_1 = require("@/App/Utils");
const Tools_1 = require("@/Tools");
const { SHARD_ID: shardId, SHARD_COUNT: shardCount } = process.env;
const shardLog = Tools_1.Console('[Shard]');
const disabledEvents = [
    'TYPING_START',
    'CHANNEL_PINS_UPDATE',
    'USER_NOTE_UPDATE',
    'USER_SETTINGS_UPDATE',
    'USER_GUILD_SETTINGS_UPDATE',
    'VOICE_STATE_UPDATE'
];
class Shard {
    constructor() {
        this.shardId = Number.parseInt(shardId, 10);
        this.shards = Number.parseInt(shardCount, 10);
        this.isExistsShard = () => new Promise((resolve, reject) => {
            if (shardId && shardCount) {
                resolve();
            }
            else {
                reject('Could not run Shard directly.');
            }
        });
        this.walkSync = (dir, fileLikeArray = []) => {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                if (fs.statSync(`${dir}/${file}`).isDirectory()) {
                    fileLikeArray = this.walkSync(path_1.join(dir, file), fileLikeArray);
                }
                else {
                    fileLikeArray.push(path_1.join(dir, file));
                }
            });
            return fileLikeArray;
        };
        this.setStatus = (status) => {
            this.instance.user.setStatus(status);
        };
        this.setActivity = (activity, options) => {
            this.instance.user.setActivity(activity, options);
        };
        this.ready = () => {
            this.setStatus('online');
            this.setActivity('Connect to ');
            this.createCycle();
            this.createDebugCycle();
            this.emit(4);
            this.isReady = true;
            shardLog.log(`Logged in as: ${this.instance.user.tag}, with ${this.instance.users.size} users of ${this.instance.guilds.size} servers.`);
        };
        this.loadConnection = () => {
            if (Constants_1.default.useRedis) {
                this.instance.Connections = new Map();
            }
            else {
                this.instance.Connections = new Map();
            }
        };
        this.loadCommand = () => {
            const commandDir = path_1.join(`${__dirname}/Commands`);
            const commandFiles = this.walkSync(commandDir).filter(file => file.includes('.Command') &&
                (file.endsWith('ts') || file.endsWith('js')));
            commandFiles.forEach(file => {
                const command = require(file).default;
                command.initialise(this.instance);
                command.aliases.unshift(command.cmds);
                command.aliases.forEach(cmd => {
                    this.instance.commands.set(cmd, command);
                });
            });
        };
        this.onMessage = async (message) => {
            if (!this.isReady ||
                !message.content.startsWith(process.env.BOT_PREFIX) ||
                message.author.bot) {
                return;
            }
            const args = message.cleanContent
                .slice(process.env.BOT_PREFIX.length)
                .trim()
                .split(/\s+/g);
            const command = args.shift().toLowerCase();
            const receivedData = { message, args };
            if (!this.instance.commands.has(command)) {
                shardLog.log(`${message.author.tag} said ${message} but there are no applicable commands.`);
                return;
            }
            for (const key of Object.keys(receivedData)) {
                this.instance.receivedData.set(key, receivedData[key]);
            }
            try {
                await this.instance.commands
                    .get(command)
                    .inspect()
                    .run();
            }
            catch (error) {
                await message.channel.send('There was an error while try to run that command!');
                shardLog.error(`The following command could not be executed, because of ${error}`);
            }
        };
        this.syncRedis = async () => {
        };
        this.emit = (eventUniqueID) => {
            process.send(eventUniqueID);
        };
        this.bindEvent = () => {
            this.instance.once('ready', this.ready);
            this.instance.on('message', this.onMessage);
            this.instance.on('warn', shardLog.warn);
            this.instance.on('error', shardLog.error);
            process.on(9, this.shutdown);
            process.on(8, this.shutdown);
            process.on('message', (cmd) => process.emit(cmd));
            process.on('SIGINT', this.shutdown);
        };
        this.createCycle = () => {
            this.Cycle = setInterval(this.syncRedis, 30 * Utils_1.MILLISECONDS_A_SECOND);
        };
        this.createDebugCycle = () => {
            this.debugCycle = setInterval(this.debug, 5 * Utils_1.MILLISECONDS_A_SECOND);
        };
        this.debug = () => {
            const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            shardLog.debug(`Used ${memoryUsed} MB`);
        };
        this.shutdown = async () => {
            clearInterval(this.Cycle);
            clearInterval(this.debugCycle);
            if (Constants_1.default.useRedis) {
            }
            try {
                await this.instance.destroy();
            }
            catch (err) {
                shardLog.error(err);
            }
        };
        shardLog.debug(process.env);
        Utils_1.Process.setTitle(`${Constants_1.default.botName} v${pkg.version} - ${process.pid}`);
        this.isExistsShard()
            .then(() => {
            this.instance = new Discord.Client({
                shardId: this.shardId,
                shardCount: this.shards,
                disabledEvents,
                messageCacheMaxSize: 25,
                messageCacheLifetime: 120,
                messageSweepInterval: 120
            });
            this.instance.login(process.env.BOT_TOKEN);
            this.instance.receivedData = new Map();
            this.instance.commands = new Discord.Collection();
            this.loadConnection();
            this.loadCommand();
            this.bindEvent();
        })
            .catch(shardLog.error);
    }
}
exports.default = new Shard();
