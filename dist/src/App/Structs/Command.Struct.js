"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor() {
        this.aliases = [];
    }
    initialise(instance) {
        this.instance = instance;
    }
    hide() {
        this.hidden = true;
    }
    hasPermission() {
    }
    async run() {
        throw new Error(`${this.constructor.name} command does not have a run() method.`);
    }
}
exports.Command = Command;
