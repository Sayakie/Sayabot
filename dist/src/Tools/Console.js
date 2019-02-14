"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const dayjs = require("dayjs");
const util_1 = require("util");
const inspectOptions = {
    colors: true,
    depth: null
};
class Console {
}
Console.out = (consoleType, atPoint, message, ...optionalParams) => {
    if (!message) {
        console.log();
        return;
    }
    const consoleDate = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    const processUptime = +process.uptime().toFixed(3);
    const processID = process.pid;
    console.log(consoleDate, processUptime, processID, consoleType, atPoint, typeof message === 'object' ? util_1.inspect(message, inspectOptions) : message, ...optionalParams);
};
Console.info = (atPoint, message, ...optionalParams) => Console.out(chalk_1.default.green("INFO"), atPoint, message, ...optionalParams);
Console.warn = (atPoint, message, ...optionalParams) => Console.out(chalk_1.default.yellow("WARN"), atPoint, message, ...optionalParams);
Console.error = (atPoint, message, ...optionalParams) => Console.out(chalk_1.default.red("ERR!"), atPoint, message, ...optionalParams);
Console.log = Console.info;
exports.ConsoleBuilder = (prefix) => ({
    log(message, ...optionalParams) {
        Console.log(chalk_1.default.yellow(prefix), message, ...optionalParams);
    },
    info(message, ...optionalParams) {
        Console.info(chalk_1.default.yellow(prefix), message, ...optionalParams);
    },
    warn(message, ...optionalParams) {
        Console.warn(chalk_1.default.yellow(prefix), message, ...optionalParams);
    },
    error(message, ...optionalParams) {
        Console.error(chalk_1.default.yellow(prefix), message, ...optionalParams);
    }
});
