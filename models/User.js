const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crypto = require('crypto');
const generateHash = require('../scripts/generateHash');

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    salt: String,
    hash: String,
    email: String,
    userInfo: {type: Schema.Types.ObjectId, ref: 'UserInfo'},
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = generateHash(password, this.salt);
}

UserSchema.methods.validatePassword = function(password) {
    return this.hash === generateHash(password);
}

module.exports = mongoose.model('User', UserSchema);