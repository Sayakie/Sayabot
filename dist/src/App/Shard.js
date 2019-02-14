"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Discord = require("discord.js");
const path_1 = require("path");
const pkg = require("package.json");
const config = require("@/Config/Config.json");
const Constants_1 = require("@/Config/Constants");
const App_1 = require("@/App");
const Utils_1 = require("@/App/Utils");
const Tools_1 = require("@/Tools");
const { SHARD_ID: shardId, SHARD_COUNT: shardCount } = process.env;
const shardLog = Tools_1.Console('[Shard]');
const disabledEvents = ['TYPING_START'];
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
            this.setActivity(`${this.instance.users.size} Users`, {
                url: 'https://sayakie.com',
                type: 'LISTENING'
            });
            process.send(4);
            shardLog.log(`Logged in as: ${this.instance.user.tag}, with ${this.instance.users.size} users of ${this.instance.guilds.size} servers.`);
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
            if (message.author.bot ||
                message.content.indexOf(config.commandPrefix) !== 0) {
                return;
            }
            const raw = message.cleanContent.slice(config.commandPrefix.length).trim().split(/\s+/g);
            const command = raw.shift().toLowerCase();
            const receivedData = { message, raw };
            if (!this.instance.commands.has(command)) {
                shardLog.log(`${message.author.tag} said ${message} but there are no applicable commands. skip it.`);
                message.channel.send(`${message.author.tag}, there are no applicable commands!`);
                return;
            }
            for (const key of Object.keys(receivedData)) {
                this.instance.receivedData.set(key, receivedData[key]);
            }
            try {
                await this.instance.commands.get(command).run();
            }
            catch (error) {
                await message.channel.send('There ware an error while try to run that command!');
                shardLog.error(`The following command could not be executed, because of ${error}`);
            }
        };
        this.fetchGuild = () => {
            App_1.App.Redis.set(`SHARD_${this.shardId}_GUILD`, this.instance.guilds.size);
        };
        this.bindEvent = () => {
            this.instance.once('ready', this.ready);
            this.instance.on('message', this.onMessage);
            process.on('message', (cmd) => process.emit(cmd));
            process.on('SIGTERM', () => {
            });
            process.on('SIGINT', () => {
            });
            process.on('SIGUSR1', () => {
            });
            process.on('SIGUSR2', () => {
            });
            process.on(14, this.fetchGuild);
            process.on(9, this.shutdown);
            process.on(8, () => this.shutdown(8));
        };
        this.shutdown = async (Events = 9) => {
            await this.instance.destroy();
            process.send(Events);
            process.exit(0);
        };
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
            this.instance.login(config.token);
            this.instance.receivedData = new Map();
            this.instance.commands = new Discord.Collection();
            this.loadCommand();
            this.bindEvent();
        })
            .catch(shardLog.error);
    }
}
exports.default = new Shard();
