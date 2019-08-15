"use strict";

module.exports = (req, res, next) => {
    if (!req.secure && process.env.NODE_ENV === "production") {
        const secureUrl = "https://" + req.headers.host + req.url;
        res.writeHead(301, {"Location": secureUrl});
        res.end();
    }
    next();
};