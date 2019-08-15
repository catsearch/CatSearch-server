"use strict";

const morgan = require("morgan");
const loggerFormat = (process.env.NODE_ENV === "production")? "tiny" : "dev";

const loggingErr = morgan(loggerFormat, {
    skip: (_req, res) => res.statusCode < 400,
    stream: process.stderr
});

const loggingOut = morgan(loggerFormat, {
    skip: (_req, res) => res.statusCode >= 400,
    stream: process.stdout
});

module.exports = {
    loggingErr: loggingErr,
    loggingOut: loggingOut
};