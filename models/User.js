const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    salt: String,
    hashedPw: String,
    email: String,
    userInfo: {type: Schema.Types.ObjectId, ref: 'UserInfo'},
});

module.exports = mongoose.model('User', UserSchema);