"use strict";

const IndicativeOptions = require("../constructors/IndicativeOptions");

module.exports = {
    "creds": new IndicativeOptions({
        "email": "required|email",
        "password": "required|min:8"
    }, {
        required: field => `${field} is required`,
        "email.email": "Please enter a valid email address",
        "password.min": "Password is too short"
    }, {
        email: "normalize_email",
        password: "strip_tags"
    })
};