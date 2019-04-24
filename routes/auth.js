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
                    res.send({
                        success: false,
                        message: err
                    });
                } else if (!user) {
                    res.send({
                        success: false,
                        message: `No user with email ${email}.`
                    });
                } else {
                    if (user.validatePassword(req.body.password)) {
                        res.send({
                            success: true,
                            message: `User logged in!`
                        });
                    } else {
                        res.send({
                            success: false,
                            message: `Incorrect password.`
                        });
                    }
                }
            })
    })

module.exports = router;