"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = (type) => (literal, ...args) => `\`\`\`${type}\n` +
    literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
    '\n```';
exports.Process = {
    setTitle(title) {
        process.title = title;
    },
    getTitle() {
        return process.title;
    }
};
exports.SECONDS_A_MINUTE = 60;
exports.SECONDS_A_HOUR = exports.SECONDS_A_MINUTE * 60;
exports.SECONDS_A_DAY = exports.SECONDS_A_HOUR * 24;
exports.SECONDS_A_WEEK = exports.SECONDS_A_DAY * 7;
exports.MILLISECONDS_A_SECOND = 1e3;
exports.MILLISECONDS_A_MINUTE = exports.SECONDS_A_MINUTE * exports.MILLISECONDS_A_SECOND;
exports.MILLISECONDS_A_HOUR = exports.SECONDS_A_HOUR * exports.MILLISECONDS_A_SECOND;
exports.MILLISECONDS_A_DAY = exports.SECONDS_A_DAY * exports.MILLISECONDS_A_SECOND;
exports.MILLISECONDS_A_WEEK = exports.SECONDS_A_WEEK * exports.MILLISECONDS_A_SECOND;
