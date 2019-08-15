const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.route('/')
    .get((req, res) => {
        console.log("GET /user");
        User.find()
            .sort('signupDate')
            .exec((err, users) => {
                if (err) {
                    console.log("Error retrieving users from database.")
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
    .put((req, res) => {
        const id = req.params["id"];
        console.log("PUT /user/" + id);

        User.findOneAndUpdate(
            {_id: id},
            req.body.user
        )
            .exec((err, user) => {
                if (err) {
                    res.send({
                        success: false,
                        message: err
                    })
                } else {
                    res.send({
                        success: true,
                        message: "Document Replaced."
                    })
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
            .sort('signupDate')
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

        let yearFilters = [];
        for (element of req.body.year) {yearFilters.push({year: element});}

        let genderFilters = [];
        for (element of req.body.gender) {genderFilters.push({gender: element});}

        let schoolFilters = [];
        for (element of req.body.school) {schoolFilters.push({school: element});}

        let areaFilters = [];
        for (element of req.body.area) {areaFilters.push({area: element});}

        let cleanlinessFilters = [];
        for (element of req.body.cleanliness) {cleanlinessFilters.push({cleanliness: element});}

        let smokingFilters = [];
        for (element of req.body.smoking) {smokingFilters.push({smoking: element});}

        let musicFilters = [];
        for (element of req.body.music) {musicFilters.push({music: element});}

        let andQuery = [];
        if (yearFilters.length > 0) {andQuery.push({$or: yearFilters})};
        if (genderFilters.length > 0) {andQuery.push({$or: genderFilters})};
        if (schoolFilters.length > 0) {andQuery.push({$or: schoolFilters})};
        if (areaFilters.length > 0) {andQuery.push({$or: areaFilters})};
        if (cleanlinessFilters.length > 0) {andQuery.push({$or: cleanlinessFilters})};
        if (smokingFilters.length > 0) {andQuery.push({$or: smokingFilters})};
        if (musicFilters.length > 0) {andQuery.push({$or: musicFilters})};

        let query = {
            //add bedtime and wakeup filters
            searching: true, //can't find people that aren't searching
        }
        if (andQuery.length > 0) {query.$and = andQuery};
        if (id !== null && id !== "null") {query._id = {$ne: id}};

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
                    if (user.savedUsers.includes(req.body.id)) {
                        console.log(`User ${req.body.id} is already saved.`)
                        res.send({
                            success: false,
                            message: "User has already been saved."
                        })
                    } else {
                        user.savedUsers.push(req.body.id);
                        User.updateOne(
                            {_id: id},
                            {$set: {"savedUsers" : user.savedUsers}}
                        )
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
                                        message: user
                                    });
                                }
                            })
                    }
                }
            })
    })

router.route('/:id/removeSaved')
    .patch((req,res) => {
        console.log("PATCH /:id/removeSaved");
        const id = req.params["id"];
        User.findOne({_id: id})
            .exec((err, user) => {
                if (err) {
                    console.log("Error in PATCH /:id/removeSaved.");
                    res.send({
                        success: false,
                        message: err
                    });
                } else {
                    user.savedUsers = user.savedUsers.filter((value,index,arr) => {
                        return value !== req.body.id;
                    });
                    User.updateOne(
                        {_id: id}, 
                        {$set: { "savedUsers" : user.savedUsers}}
                    )
                        .exec((err, user) => {
                            if (err) {
                                res.send({
                                    success: false,
                                    message: err
                                })
                            } else {
                                res.send({
                                    success: true,
                                    message: user
                                })
                            }
                        })
                }
            })
    })

router.route('/:id/search')
    .post((req, res) => {
        console.log("POST /:id/search");
        const id = req.params["id"];

        let query = {
            $or: [
                {name: {'$regex': req.body.text, '$options' : 'i'}},
                {blurb: {'$regex': req.body.text, '$options' : 'i'}}
            ],
            searching: true
        }
        if (id && id !== "null") {query._id = {$ne: id}}

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

router.route('/:id/removeSavedUsers')
    .patch((req, res) => {
        User.updateOne({_id: req.params["id"]},
            {$set: {"savedUsers" : []}})
            .exec((err, user) => {
                res.send(user)
            })
    })

module.exports = router;