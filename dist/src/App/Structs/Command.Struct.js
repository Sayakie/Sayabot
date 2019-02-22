"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("@/Config/Constants");
class Command {
    initialise(instance) {
        this.instance = instance;
        this.aliases = [];
        this.isEnable = true;
    }
    hide() {
        this.hidden = true;
    }
    disable() {
        this.isEnable = false;
    }
    isOwner() {
        if (Constants_1.default.owners.includes(this.message.member.id)) {
            return true;
        }
        return false;
    }
    hasPermission(PermissionType) {
        if (this.message.member.hasPermission(PermissionType)) {
            return true;
        }
        return false;
    }
    inspect() {
        this.message = this.instance.receivedData.get('message');
        this.args = this.instance.receivedData.get('args');
        if (this.guildOnly && this.message.guild === null) {
            console.log('빼액');
            this.disable();
        }
        return this;
    }
    async run() {
        throw new Error(`${this.constructor.name} command does not have a run() method.`);
    }
}
exports.Command = Command;
