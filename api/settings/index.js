const settingsRouter = require('express').Router();
const Setting = require('../../models/setting');

const { validateTokenMiddleware } = require('../../utils/middlewares');

settingsRouter.use(validateTokenMiddleware);

// Obtener los ajustes actuales
settingsRouter.get('/', (req, res) => {
  Setting
    .findOne()
    .then(set => {
      res.send({ settings: set });
    })
    .catch(error => {
      console.log('Error inesperado', error);
      res.status(500).send({error: 'Something went wrong on the DB.'});
    });
});

// Guardar nuevos ajustes
settingsRouter.put('/', (req, res) => {
  const { settings = {} } = req.body;
  Setting
    .findOne()
    .then(oldSettings => {
      return oldSettings.update(settings);
    })
    .then(() => {
      res.send({
        message: 'Settings actualizados exitosamente!'
      });
    })
    .catch(error => {
      console.log('Error inesperado', error);
      res.status(500).send({error: 'Something went wrong on the DB.'});
    });
});

module.exports = settingsRouter;