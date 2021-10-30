const bcrypt = require('bcryptjs');

const userService = {

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  getUsers(db) {
    return db
      .select('*')
      .from('users');
  },

  validateUserName(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user);
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user );
  }
};

module.exports = userService;