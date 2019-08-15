"use strict";

const dotenv = require("dotenv");
dotenv.config();

const logger = require("./src/logger");
const env = "" + process.env.NODE_ENV;
logger.info("ENV: " + env);

const config = require('./config/db')["dev" || env];
const mongoose = require('mongoose');
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}, err => {
    if (err) {
        logger.error("Could not connect to database.");
        logger.error(`${err.name}: ${err.errorLabels}`);
        process.exit(1);
    } else {
        logger.info("Connected to database.");
    }
});

const express = require('express');
const app = express();

// Parses request bodies
const bodyParser = require("body-parser");
const bpConfig = {limit: "10mb", extended: true};
app.use(bodyParser.urlencoded(bpConfig));
app.use(bodyParser.json(bpConfig));

// Forces non-HTTPS routes to redirect
// To use, set up SSL and convert to an http/https server
// const https = require("./src/middleware/https");
// app.use(https);

// Parses cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Adds CORS headers to requests
const cors = require("./src/middleware/cors");
app.use(cors);

// Logging
const morgan = require("./src/middleware/morgan");
app.use(morgan.loggingErr);
app.use(morgan.loggingOut);

// Sets various security-related HTTP headers
const helmet = require("helmet");
app.use(helmet());

const routes = require("./config/routes");
Object.entries(routes).forEach(([route, router]) => {
    app.use(route, router);
});

const PORT = process.env.PORT || 8081;
app.listen(PORT);
logger.info("Application listening on PORT: " + PORT);

module.exports = app;