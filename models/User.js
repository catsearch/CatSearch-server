const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    signupDate: Date,
    gender: String,
    year: String,
    major: String,
    northSouth: String,
    sleep: String,
    wake: String,
    smoke: Boolean,
    cleanliness: String,
    music: Boolean,
    blurb: String,
    picUrl: String,
    searching: Boolean
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