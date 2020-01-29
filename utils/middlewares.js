const { validarToken } = require('./jwtFunctions');

function validateTokenMiddleware(req, res, next) {
  const token = req.get('jwt');

  validarToken(token)
  .then(() => next())
  .catch(() => res.send('Por favor inicia sesion.'));
}

module.exports = {
  validateTokenMiddleware
};