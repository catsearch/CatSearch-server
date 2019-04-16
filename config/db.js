const info = require('../secret.js')

const config = {
    "dev":{
        "host":"localhost",
        "database":info["devDatabase"],
    },
};

module.exports = config;