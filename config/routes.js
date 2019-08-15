"use strict";

module.exports = {
    "/auth": require("../controllers/AuthController"),
    "": require("../controllers/DefaultController"),
    "/user": require("../controllers/UserController")
};