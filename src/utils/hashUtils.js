const bcrypt = require('bcrypt');

async function hashearPassword(password) {
  return await bcrypt.hash(password, 10);
}

module.exports = { hashearPassword };
