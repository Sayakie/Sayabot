"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_Struct_1 = require("@/App/Structs/Command.Struct");
const Tools_1 = require("@/Tools");
const diff = (literal, ...args) => '```diff\n' +
    literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
    '\n```';
const commandLog = Tools_1.Console('[Command]');
class ShardInfo extends Command_Struct_1.Command {
    constructor() {
        super();
        this.cmds = 'shardinfo';
        this.aliases = ['shards'];
        this.description = '';
        this.group = "administrative";
        this.hide();
    }
    async run() {
        const pool = 'hi';
        await this.message.channel.send(diff `${pool}`).catch(commandLog.error);
    }
}
exports.default = new ShardInfo();
