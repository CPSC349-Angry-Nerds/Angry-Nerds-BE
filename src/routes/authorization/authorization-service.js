const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const config = require('./../../config');

const AuthorizationService = {
  getUser(db, username){
    return db('user')
      .where({ username })
      .first();
  },
  getUserWithUserName(db, username){
    return db.from('user')
      .where('username', username)
      .first();
  },
  comparePassword(password, hash) {
    return bcrypt.compare(password,hash);
  },
  createJsonWebToken(subject, payload) {
    return jsonwebtoken.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256'
    });
  },
  verifyJsonWebToken(token){
    return jsonwebtoken.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256']
    });
  }
};

module.exports = AuthorizationService;