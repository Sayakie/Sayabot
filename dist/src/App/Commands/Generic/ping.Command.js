"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_Struct_1 = require("@/App/Structs/Command.Struct");
const Tools_1 = require("@/Tools");
const tagged = (literal, ...args) => '```autohotkey\n' +
    literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
    '\n```';
const commandLog = Tools_1.Console('[Command]');
class Ping extends Command_Struct_1.Command {
    constructor() {
        super();
        this.cmds = 'ping';
        this.description = '';
        this.group = "generic";
    }
    async run() {
        const message = this.instance.receivedData.get('message');
        await message.channel
            .send('Ping?')
            .then(async (msg) => {
            await msg.edit(tagged `Pong! Took ${this.instance.ping} ms`);
        })
            .catch(commandLog.error);
    }
}
exports.default = new Ping();
