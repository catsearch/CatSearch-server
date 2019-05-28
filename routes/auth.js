const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.route('/createAccount')
    .post((req, res) => {
        console.log("POST /user");
        const email = req.body.email;

        User.findOne({email: email})
            .exec((err, user) => {
                if (err) {
                    res.send({
                        success: false,
                        message: err
                    })
                } else if (user) {
                    res.send({
                        success: false,
                        message: `User with email ${email} already exists.`
                    })
                } else {
                    const newUser = new User();
                    newUser.email = req.body.email;
                    newUser.name = req.body.name;
                    newUser.generateHash(req.body.password);
                    newUser.initializeFields();
                    newUser.save((err, user) => {
                        if (err) {
                            res.send({
                                success: false,
                                message: err
                            });
                        } else {
                            res.send({
                                success: true,
                                message: `Account Created!`
                            });
                        }
                    });
                }
            })
        
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
                            _id: user._id
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