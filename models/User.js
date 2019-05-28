const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    email: String,
    password: String,
    name: String,
    signupDate: Date,
    searching: Boolean,
    savedUsers: Array,
    blurb: String,
    picUrl: String,
    year: String,
    gender: String,
    school: String,
    area: String,
    cleanliness: String,
    smoking: String,
    music: String,
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

UserSchema.methods.initializeFields = function() {
    this.signupDate = Date();
    this.searching = true;
    this.savedUsers = [];
    this.picUrl = "";
    this.year = "";
    this.blurb = "";
    this.gender = "";
    this.school = "";
    this.area = "";
    this.cleanliness = "";
    this.smoking = "";
    this.music = "";
}

module.exports = mongoose.model('User', UserSchema);