const crypto = require('crypto');

function createCrypto(byte) {
    return crypto.randomBytes(byte).toString('hex');
}

console.log(createCrypto(32));
console.log(createCrypto(64));