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
    .post((req, res) => {
        console.log("POST /users");

        let user = new User();
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.setPassword(req.body.password);
        user.email = req.body.email;

        let userInfo = new UserInfo();
        user.userInfo = userInfo;

        user.save((err, user) => {
            if (err) {
                console.log("Error adding user " + user.username);
                res.send(err);
            } else {
                console.log("User " + user.username + " added.");
                res.sendFile('login.html', {root: path.join(__dirname, '../screens/login/')});
            }
        });
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

router.route('/:username')
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