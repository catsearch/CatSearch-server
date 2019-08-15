"use strict";

const response = require("../constructors/responseBody");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies["access-token"];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, err => {
            if (err) {
                res.clearCookie("access-token");
                res.send(response(false, err));
            } else {
                next();
            }
        });
    } else {
        res.send(response(false, "No token provided"));
    }
};