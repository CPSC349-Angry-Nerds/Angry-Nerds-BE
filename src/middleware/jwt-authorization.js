const { JsonWebTokenError } = require('jsonwebtoken');
const AuthorizationService = require('../routes/authorization/authorization-service');

async function middlewareAuth(req, res, next) {
  let bearerToken = '';
  const authToken = req.get('Authorization') || '';
  
  if (!authToken.toLowerCase().startsWith('bearer '))
    return res.status(401).json({ error: 'Missing bearer token' });
  else 
    bearerToken = authToken.slice(7, authToken.length);

  try {
    const payload = AuthorizationService.verifyJsonWebToken(bearerToken);
    const user = await AuthorizationService.getUserWithUserName(req.app.get('db'), payload.sub);

    if (!user)
      return res.status(401).json({ error: 'Unauthorized Request' });
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError)
      return res.status(401).json({ error: 'Unauthorized Request' });

    next(error);
  }
}

module.exports = {
  middlewareAuth
};