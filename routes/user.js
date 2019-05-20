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
                    res.send({
                        success: false,
                        message: err
                    });
                } else {
                    console.log(users);
                    res.send({
                        success: true,
                        users: users
                    });
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
                    res.send({
                        success: false,
                        message: err
                    });
                } else {
                    res.send({
                        success: true,
                        user: user
                    });
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
            male: req.body.male,
            female: req.body.female,
            other: req.body.other,
            bienen: req.body.bienen,
            mccormick: req.body.mccormick,
            medill: req.body.medill,
            sesp: req.body.sesp,
            soc: req.body.soc,
            wcas: req.body.wcas,
            north: req.body.north,
            mid: req.body.mid,
            south: req.body.south,
            high: req.body.high,
            medium: req.body.medium,
            low: req.body.low,
            smoking: req.body.smoking,
            no: req.body.no,
            often: req.body.often,
            sometimes: req.body.sometimes,
            never: req.body.never,
            //bedtime and wakeup
            searching: true, //can't find people that aren't searching
        }

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
                    console.log(users)
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
        console.log(req.body.text)

        let query = {
            _id: {$ne: id},
            $or: [
                {firstName: {'$regex': req.body.text, '$options' : 'i'}},
                {lastName: {'$regex': req.body.text, '$options' : 'i'}},
                {blurb: {'$regex': req.body.text, '$options' : 'i'}}
            ],
            searching: true
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