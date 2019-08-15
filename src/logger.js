"use strict";

const {createLogger, format, transports} = require("winston");
const env = process.env.NODE_ENV;
const level = env === "production"? "info" : "debug";

const fs = require("fs");
const logDir = "./log";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const path = require("path");
const filename = path.join(logDir, `${env}.log`);

const logFormat = format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`);

const logger = createLogger({
    level: level,
    transports: [
        new transports.Console({
            level: level,
            format: format.combine(
                format.colorize(),
                    format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss.sss"
                }),
                logFormat
            )
        }),
        new transports.File({filename})
    ]
});

function formatLog(args) {
    args = Array.prototype.slice.call(args);

    // These formattings are too verbose for prod
    if (env !== "production") {
        // Format JSON
        args.forEach((arg, i) => {
            if (typeof(arg) === "object") {
                args[i] = JSON.stringify(arg);
            }
        });

        // Add stack info
        const stackInfo = getStackInfo(1);
        if (stackInfo) {
            const calleeStr = `(${stackInfo.file}:${stackInfo.line})`;
            args.unshift(calleeStr);
        }
    }

    // Handle multiple arguments
    return [args.join(" ")];
}

// https://gist.github.com/ludwig/b47b5de4a4c53235825af3b4cef4869a
function getStackInfo(stackIndex) {
    const stacklist = (new Error()).stack.split('\n').slice(3);

    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackRegBackup = /at\s+()(.*):(\d*):(\d*)/gi;

    const s = stacklist[stackIndex] || stacklist[0];
    const stackRegArr = stackReg.exec(s) || stackRegBackup.exec(s);

    if (stackRegArr && stackRegArr.length === 5) {
        return {
            line: stackRegArr[3],
            file: path.basename(stackRegArr[2])
        };
    }
}

logger.stream = {
    write: (message) => {
        logger.info(message);
    }
};

module.exports.debug = module.exports.log = function() {
    logger.debug.apply(logger, formatLog(arguments));
};

module.exports.info = function() {
    logger.info.apply(logger, formatLog(arguments));
};

module.exports.warn = function() {
    logger.warn.apply(logger, formatLog(arguments));
};

module.exports.error = function() {
    logger.error.apply(logger, formatLog(arguments));
};

module.exports.stream = logger.stream;