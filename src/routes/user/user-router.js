const express = require('express');
const userRouter = express.Router();
const parser = express.json();
const UserService = require('./user-service');
const AuthorizationService = require('../authorization/authorization-service');
const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const errorHandler = {
  validateUserRequest(body) {
    let result = {
      isError: false,
      error: ''
    };

    for (const key of ['username', 'password']) {
      if (!body[key]) {
        result.isError = true;
        result.error = `Missing ${key} in request body`;
        return result;
      }

      if (body.key === null) {
        result.isError = true;
        result.error = `Missing a value for "${key}"`;
        return result;
      }
    }
    return result;
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!regex.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  }
};

userRouter
  .route('/')
  .get(async (req, res, next) => {
    const db = req.app.get('db');
    await UserService
      .getUsers(db)
      .then(users => {
        !users
          ? res.status(400).send({ error: 'Can not get users from the database' })
          : res.status(200).send(users);
      })
      .catch(next);
  })
  .post(parser, async (req, res, next) => {
    try
    {
      const { password, username } = req.body;
      const { isError, error } = errorHandler.validateUserRequest(req.body);
      const db = req.app.get('db');
      
      if (isError)
        throw error;
      else {
        await UserService
          .hashPassword(password)
          .then(hash => {
            const passwordError = errorHandler.validatePassword(password);

            if (passwordError)
              throw new Error(`${passwordError}`);

            return {
              username,
              password: hash
            };
          })
          .then(async (newUser) => {
            const user = await UserService.validateUserName(db, newUser.username);
            if (user) 
              throw new Error('Username already taken');
            else 
              UserService.insertUser(db, newUser);
            return newUser;
          })
          .then(user => {
            const sub = user.username;
            const payload = {
              username: user.username
            };
            return res.send({ authToken: AuthorizationService.createJsonWebToken(sub, payload) });
          })
      
      }
     }catch (error){
      next(error)
    }
  });

module.exports = userRouter;