const info = require('../secret.js')

const config = {
    "dev":{
        "host":"localhost",
        "database":info["database"],
    },
};

module.exports = config;