"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_Struct_1 = require("@/App/Structs/Command.Struct");
const Utils_1 = require("@/App/Utils");
const Tools_1 = require("@/Tools");
const tagged = Utils_1.Embed('autohotkey');
const commandLog = Tools_1.Console('[Command]');
class Ping extends Command_Struct_1.Command {
    constructor() {
        super();
        this.cmds = 'ping';
        this.description = '';
        this.group = "generic";
    }
    async run() {
        await this.message.channel
            .send('Ping?')
            .then(async (msg) => {
            await msg.edit(tagged `Pong! Took ${msg.createdTimestamp -
                this.message.createdTimestamp} ms. API Latency tooks ${Math.round(this.instance.ping)}ms`);
        })
            .catch(commandLog.error);
    }
}
exports.default = new Ping();
