const express = require('express');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');

const router = express.Router();

router.route('/')
    .get(function(req, res) {
        console.log("GET /users");
        User.find()
            .sort('firstname')
            .exec(function(err, users) {
                if (err) {
                    console.log("Error retrieving users from database.")
                    res.send(err);
                } else {
                    console.log(users);
                    res.send(users);
                }
            })
    })
    .post(function(req, res) {
        console.log("POST /users");

        const salt = "ksjdfhskdjbkvjshdsjdhvbsdkjfsdkf" //should be randomly generated

        let user = new User();
        user.username = req.body.username;
        user.salt = salt;
        user.hashedPw = req.body.password + salt; //implement hashing algorithm
        user.email = req.body.email;

        let userInfo = new UserInfo();
        user.userInfo = userInfo;

        user.save(function(err, response) {
            if (err) {
                console.log("Error adding user " + user.username);
                res.send(err);
            } else {
                console.log(response);
                res.send(response);
            }
        });
    });

router.route('/:id')
    .get(function(req, res) {
        const id = req.params["id"];
        User.find({_id: id})
            .sort('firstname')
            .exec(function(err, user) {
                if (err) {
                    console.log("Error " + err + "retrieving user " + user + ".");
                    res.send(err);
                } else {
                    res.send(user);
                }
            })
    })
    .delete(function(req, res) {
        const id = req.params["id"];
        User.deleteOne({_id: id})
            .exec(function(err, user) {
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