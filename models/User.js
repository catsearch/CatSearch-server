const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    signupDate: Date,
    blurb: String,
    picUrl: String,
    searching: Boolean,
    male: Boolean,
    female: Boolean,
    other: Boolean,
    bienen: Boolean,
    mccormick: Boolean,
    medill: Boolean,
    sesp: Boolean,
    soc: Boolean,
    wcas: Boolean,
    north: Boolean,
    mid: Boolean,
    south: Boolean,
    high: Boolean,
    medium: Boolean,
    low: Boolean,
    smoking: Boolean,
    no: Boolean,
    often: Boolean,
    sometimes: Boolean,
    never: Boolean,
    //bedtime and wakeup
});

// generating a hash
UserSchema.methods.generateHash = function(password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking for matching password
UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);