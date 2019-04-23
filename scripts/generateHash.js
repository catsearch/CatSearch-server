const crypto = require('crypto');

function generateHash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
}

module.exports = generateHash;