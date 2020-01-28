const authRouter = require('express').Router();
const User = require('../../models/user');
const crearJwt = require('../../utils/jwtFunctions').crearJwt;

authRouter.post('/', (req, res) => {
  const { username = null, password = null } = req.body;
  const handleError = () => res
    .status(500)
    .json(
      {
        error: {
          message: 'No sabemos lo que ha pasado.',
        }
      }
    );

  if (!username || !password) {
    res.status(401).json({
      error: {
        message: 'No tienes poder aquí.'
      }
    });
    return; // Prevenir la ejecución del resto del código
  }

  User.findOne({
    login: username
  })
  .then(res => {
    if (!res) {
      res.status(401).json({
        error: {
          message: 'No tienes poder aquí.'
        }
      });
      return;
    }
    if (res.password !== password) {
      res.status(401).json({
        error: {
          message: 'No tienes poder aquí.'
        }
      });
      return;
    }
    return res;
  })
  .then(user => {
    crearJwt({userId: user._id})
    .then(token => res.send({
      token
    }))
    .catch(handleError); // Catch al crear JWT
  })
  .catch(handleError); // Catch en el modelo de mongoose
});

module.exports = authRouter;