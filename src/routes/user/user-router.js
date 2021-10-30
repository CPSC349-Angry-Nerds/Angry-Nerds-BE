const express = require('express');
const userRouter = express.Router();
const parser = express.json();
const UserService = require('./user-service');
const AuthorizationService = require('../authorization/authorization-service');
const db = req.app.get('db');

const errorHandler = {
  validateAuthRequest(body) {
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
    return null;
  }
};

userRouter
  .route('/')
  .get(async (req, res, next) => {
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

      if (isError)
        throw error;
      else {
        await UserService
          .hashPassword(password)
          .then(hash => {
            const passwordError = errorHandler.validatePassword(password);

            if (passwordError)
              return res.status(400).send({ error: passwordError });

            return {
              username,
              password: hash
            };
          })
          .then(async (newUser) => {
            await UserService.validateUserName(db, newUser.username)
              ? res.status(400).send({ error: 'Username already taken' })
              : UserService.insertUser(db, newUser);
            return newUser;
          })
          .then(user => {
            const sub = user.username;
            const payload = {
              username: user.username
            };
            res.send({ authToken: AuthorizationService.createJsonWebToken(sub, payload) });
          })
      
      }
     }catch (error){
      next(error)
    }
  });

module.exports = userRouter;