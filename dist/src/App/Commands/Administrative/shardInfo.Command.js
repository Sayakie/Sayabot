"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("@/App");
const Command_Struct_1 = require("@/App/Structs/Command.Struct");
const Tools_1 = require("@/Tools");
const diff = (literal, ...args) => '```diff\n' +
    literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
    '```';
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
        let str = '';
        const message = this.instance.receivedData.get('message');
        process.send(14);
        const guilds = new Map([...App_1.App.Redis].filter(([k, v]) => k.match(/SHARD_\d{1,}_GUILD/)));
        guilds.forEach((v, k) => {
            str += `+ [✔️] ${k.replace(/\D/g, '')}: CONNECTED ~ ${v} guilds`;
        });
        await message.channel.send(diff `${str}`).catch(commandLog.error);
    }
}
exports.default = new ShardInfo();
