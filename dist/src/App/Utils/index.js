"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = {
    setTitle(title) {
        process.title = title;
    },
    getTitle() {
        return process.title;
    }
};
