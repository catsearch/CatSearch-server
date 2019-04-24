const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.route('/createAccount')
    .post((req, res) => {
        console.log("POST /user");
        const newUser = new User();
        newUser.email = req.body.email;
        newUser.generateHash(req.body.password);
        newUser.save((err, user) => {
            if (err) {
                res.send(err);
            } else {
                console.log(user);
                res.send(user);
            }
        });
    })

router.route('/login')
    .post((req, res) => {
        console.log('GET user/login')
        const email = req.body.email;

        User.findOne({email: email})
            .exec((err, user) => {
                if (err) {
                    res.send(err);
                } else if (!user) {
                    console.log(`No user with email ${email}.`);
                    res.send(`No user with email ${email}.`);
                } else {
                    console.log(req.body);
                    if (user.validatePassword(req.body.password)) {
                        console.log(`User logged in!`);
                        res.send(`User logged in!`);
                    } else {
                        console.log('Incorrect password.')
                        res.send(`Incorrect password.`);
                    }
                }
            })
    })

module.exports = router;