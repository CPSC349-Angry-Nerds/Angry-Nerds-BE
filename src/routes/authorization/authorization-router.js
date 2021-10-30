const express = require('express');
const AuthorizationService = require('./authorization-service');
const { middlewareAuth } = require('../../middleware/jwt-authorization');
const authRouter = express.Router();
const parser = express.json();

const validateAuthRequest = (body) => {
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
};

authRouter
  .route('/')
  .post(parser, async (req, res, next) => {
    const { username, password } = req.body;
    const { error, isError } = validateAuthRequest(req.body);
    const db = req.app.get('db');
    const errorMessage = 'Incorrect username or password';

    if (isError)
      return res.status(400).send({error});
    else
      await AuthorizationService
        .getUser(db, username)
        .then(user => {
          if(!user)
            return res.status(400).send({error: errorMessage});
          return user;
        })
        .then( async user => {
          const validatePassword = await AuthorizationService.comparePassword(password, user.password);
         
          if(!validatePassword)
            return res.status(400).send({ error: errorMessage });
          return user;
        })
        .then(user => {
          const sub = user.username;
          const payload = {
            username: user.username,
          };
          res.send({ authToken: AuthorizationService.createJsonWebToken(sub, payload) })
        })
        .catch(next);
  })
  .put(middlewareAuth, (req, res, next) => {
    try{
      const sub = req.user.username;
      const payload = {
        username: req.user.username
      };
      res.send({ authToken: AuthorizationService.createJsonWebToken(sub, payload) });
    } catch (error) {
      next(error);
    }
});

module.exports = authRouter;