"use strict";

const jwt = require("jsonwebtoken");

module.exports = {
    sign: (payload, expires) => {
            const options = {
                expiresIn: expires
            };
            return jwt.sign(payload, process.env.JWT_SECRET, options);
          },
    payload: token => {
        return jwt.decode(token);
    }
};