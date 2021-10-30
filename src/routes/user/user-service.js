const bcrypt = require('bcryptjs');

const userService = {

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  getUsers(db) {
    return db
      .select('*')
      .from('user');
  },

  validateUserName(db, username) {
    return db('user')
      .where({ username })
      .first()
      .then(user => !!user);
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user );
  }
};

module.exports = userService;