// generate-secret.js
const crypto = require('crypto');

// Generate a 64-character hex string
const secret = crypto.randomBytes(32).toString('hex');
console.log('Generated JWT Secret:', secret);
