const bcrypt = require('bcrypt')
//PASSWORD HASHING
async function hashPassword(password) {
    const saltRounds = 10; // Adjust this value as needed (higher for more security)
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error hashing password");
    }
  }

  module.exports = hashPassword