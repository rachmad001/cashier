require('dotenv').config();
const crypto = require('crypto');
const key = process.env.KEY;
const iv = Buffer.from(process.env.IV, 'base64');

const encrypt = (text) => {
    var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);
    var encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return encrypted.toString('hex');
}

const decrypt = (text) => {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

var fromText = encrypt("05e9f5475db5042627185b5cd15ad232");
console.log(decrypt("05e9f5475db5042627185b5cd15ad232"));
module.exports = {encrypt, decrypt}