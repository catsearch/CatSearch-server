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

        //in each grouping, filter OR by only TRUE results
        let genderFilters = [];
        if (req.body.male) {genderFilters.push({male: req.body.male})};
        if (req.body.female) {genderFilters.push({female: req.body.female})};
        if (req.body.other) {genderFilters.push({other: req.body.other})};

        let schoolFilters = [];
        if (req.body.bienen) {schoolFilters.push({bienen: req.body.bienen})};
        if (req.body.mccormick) {schoolFilters.push({mccormick: req.body.mccormick})};
        if (req.body.medill) {schoolFilters.push({medill: req.body.medill})};
        if (req.body.sesp) {schoolFilters.push({sesp: req.body.sesp})};
        if (req.body.soc) {schoolFilters.push({soc: req.body.soc})};
        if (req.body.wcas) {schoolFilters.push({wcas: req.body.wcas})};

        let locationFilters = [];
        if (req.body.north) {locationFilters.push({north: req.body.north})};
        if (req.body.mid) {locationFilters.push({mid: req.body.mid})};
        if (req.body.south) {locationFilters.push({south: req.body.south})};

        let cleanFilters = [];
        if (req.body.high) {cleanFilters.push({high: req.body.high})};
        if (req.body.medium) {cleanFilters.push({medium: req.body.medium})};
        if (req.body.low) {cleanFilters.push({low: req.body.low})};

        let smokingFilters = [];
        if (req.body.smoking) {smokingFilters.push({smoking: req.body.smoking})};
        if (req.body.no) {smokingFilters.push({no: req.body.no})};

        let musicFilters = [];
        if (req.body.often) {musicFilters.push({often: req.body.often})};
        if (req.body.sometimes) {musicFilters.push({sometimes: req.body.sometimes})};
        if (req.body.never) {musicFilters.push({never: req.body.never})};

        let andQuery = [];
        if (genderFilters.length > 0) {andQuery.push({$or: genderFilters})};
        if (schoolFilters.length > 0) {andQuery.push({$or: schoolFilters})};
        if (locationFilters.length > 0) {andQuery.push({$or: locationFilters})};
        if (cleanFilters.length > 0) {andQuery.push({$or: cleanFilters})};
        if (smokingFilters.length > 0) {andQuery.push({$or: smokingFilters})};
        if (musicFilters.length > 0) {andQuery.push({$or: musicFilters})};

        let query = {
            //add bedtime and wakeup filters
            searching: true, //can't find people that aren't searching
        }
        if (andQuery.length > 0) {query.$and = andQuery};
        if (req.body.year) {query.year = req.body.year};
        if (id !== null && id !== "null") {query._id = {$ne: id}};

        console.log(query)
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

router.route('/:id/saveUser')
    .patch((req,res) => {
        console.log("PATCH /:id/saveUser")
        const id = req.params["id"] 
        User.findOne({_id: id})
            .exec((err, user) => {
                if (err) {
                    console.log("Error in PATCH /:id/saveUser.");
                    res.send({
                        success: false,
                        message: err
                    });
                } else {
                    res.send({
                        success: true,
                    });
                    user.savedUsers.push(req.body.id);
                    User.update({_id: id},
                                {$set: {"savedUsers" : user.savedUsers}});
                }
            })
    })

router.route('/:id/removeUser')
.patch((req,res) => {
    console.log("PATCH /:id/removeUser")
    const id = req.params["id"] 
    User.findOne({_id: id})
        .exec((err, user) => {
            if (err) {
                console.log("Error in PATCH /:id/removeUser.");
                res.send({
                    success: false,
                    message: err
                });
            } else {
                res.send({
                    success: true,
                });
                user.savedUsers.filter(function(value,index,arr){
                    return value !== req.body.id;
                });
                User.update({_id: id}, 
                            {$set: { "savedUsers" : user.savedUsers}});
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