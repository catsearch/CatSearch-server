const crypto = require('crypto');

module.exports = (password) => {
    const salt = crypto.randomBytes(256);

    const hash = crypto.createHash("sha256")
        .update(password + salt)
        .digest("hex")

    return {
        "salt": salt,
        "hash": hash
    };
}