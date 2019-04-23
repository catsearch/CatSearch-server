const express = require('express');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const path = require('path');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        console.log("GET /users");
        User.find()
            .sort('firstname')
            .exec((err, users) => {
                if (err) {
                    console.log("Error retrieving users from database.")
                    res.send(err);
                } else {
                    console.log(users);
                    res.send(users);
                }
            })
    })
    .delete((req, res) => {
        console.log("DELETE /users");
        User.deleteMany()
            .exec((err, users) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Goodbye, everyone!");
                }
            })
    })

router.route('/:id')
    .get((req, res) => {
        const id = req.params["id"];
        console.log("GET /users/" + id);

        User.find({_id: id})
            .sort('firstname')
            .exec((err, user) => {
                if (err) {
                    console.log("Error " + err + "retrieving user " + user + ".");
                    res.send(err);
                } else {
                    res.send(user);
                }
            })
    })
    .delete((req, res) => {
        const id = req.params["id"];
        console.log("DELETE /users/" + id);

        User.deleteOne({_id: id})
            .exec((err, user) => {
                if (err) {
                    console.log("Error " + err + "removing user " + user + ".");
                    res.send(err);
                } else {
                    console.log("User " + user + " removed.");
                    res.send(user);
                }
            })
    });

module.exports = router;