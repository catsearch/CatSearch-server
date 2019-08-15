"use strict";

module.exports = {
    "development":{
        "host":"http://localhost:8081",
        "clientHost":"http://localhost:3000",
        "database":`mongodb+srv://dev:${process.env.MONGO_PW_DEV}@DATABASE_HANDLE.mongodb.net/test?retryWrites=true&w=majority`
    },
    "production":{
        "host":"https://catsearch-nu.herokuapp.com/api",
        "clientHost":"https://catsearch-nu.herokuapp.com/",
        "database":`mongodb+srv://prod:${process.env.MONGO_PW_PROD}@DATABASE_HANDLE.mongodb.net/prod?retryWrites=true&w=majority`
    }
};