const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({
    firstname: String,
    lastname: String,
    gender: String,
    year: String,
    major: String,
    searching: Boolean,
    northSouth: String,
    sleep: String,
    wake: String,
    smoke: Boolean,
    cleanliness: String,
    music: Boolean,
    notes: String
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);