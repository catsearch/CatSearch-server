const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({
    firstname: String,
    lastname: String,
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);