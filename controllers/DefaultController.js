"use strict";

const express = require("express");
const router = express.Router();

router.route("/")
    .get((_req, res) => {
        res.status(200).send("App is running");
    });

module.exports = router;