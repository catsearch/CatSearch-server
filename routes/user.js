const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.route('/')
    .get((req, res) => {
        console.log("GET /user");
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
        console.log("DELETE /user");
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
        console.log("GET /user/" + id);

        User.findOne({_id: id})
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
        console.log("DELETE /user/" + id);

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

router.route('/:id/others')
    .get((req, res) => {
        console.log("GET /:id/others");
        const id = req.params["id"];
        
        User.find({_id: {$ne: id}, searching: true})
            .exec((err, users) => {
                if (err) {
                    console.log("Error in GET /:id/others.");
                    res.send({
                        success: false,
                        message: err
                    });
                } else {
                    res.send({
                        success: true,
                        users: users
                    });
                }
            })
    })

router.route('/:id/filter')
    .post((req, res) => {
        console.log("POST /:id/filter");
        const id = req.params["id"];

        let query = {
            _id: {$ne: id},
            searching: true, //can't find people that aren't searching
        }
        
        if (req.body.gender) {query.gender = req.body.gender;}
        if (req.body.year) {query.year = req.body.year;}
        if (req.body.major) {query.major = req.body.major;}
        if (req.body.northSouth) {query.northSouth = req.body.northSouth;}
        if (req.body.sleep) {query.sleep = req.body.sleep;}
        if (req.body.wake) {query.wake = req.body.wake;}
        if (req.body.smoke) {query.smoke = req.body.smoke;}
        if (req.body.cleanliness) {query.cleanliness = req.body.cleanliness;}
        if (req.body.music) {query.music = req.body.music;}

        User.find(query)
            .sort('signupDate')
            .exec((err, users) => {
                if (err) {
                    console.log(`Error in POST /:${id}/filter`);
                    res.send({
                        success: false,
                        message: err
                    });
                } else {
                    res.send({
                        success: true,
                        users: users
                    });
                }
            })
    })

router.route('/:id/search')
    .post((req, res) => {
        console.log("POST /:id/search");
        const id = req.params["id"];
        const searchQuery = new RegExp(`/.*${req.body.text}.*/i`);

        let query = {
            _id: {$ne: id},
            $or: [
                {firstName: "Michael"},
            ],
            searching: true, //can't find people that aren't searching
        }

        User.find(query)
            .sort('signupDate')
            .exec((err, users) => {
                if (err) {
                    console.log(`Error in POST /:${id}/search`);
                    res.send({
                        success: false,
                        message: err
                    });
                } else {
                    res.send({
                        success: true,
                        users: users
                    });
                }
            })
    })

module.exports = router;