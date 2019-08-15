"use strict";

const env = "" + process.env.NODE_ENV;
const config = require("../../config/config")[env || "development"];

module.exports = (_req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.clientHost);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", true);
    next();
};