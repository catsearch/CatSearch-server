const express = require('express');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');

const router = express.Router();
const hash = require('../scripts/hash');

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
        user.username = req.body.username;
        const hashResult = hash(req.body.password);
        user.salt = hashResult["salt"];
        user.hashedPw = hashResult["hash"];
        user.email = req.body.email;

        let userInfo = new UserInfo();
        user.userInfo = userInfo;

        user.save((err, response) => {
            if (err) {
                console.log("Error adding user " + user.username);
                res.send(err);
            } else {
                console.log(response);
                res.send(response);
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