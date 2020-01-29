const settingsRouter = require('express').Router();
const { validateTokenMiddleware } = require('../../utils/middlewares');

settingsRouter.use(validateTokenMiddleware);

settingsRouter.get('/', (req, res) => {
  res.send('Listar todos los settings');
});

settingsRouter.post('/', (req, res) => {
  res.send('Crear un setting');
});

settingsRouter.delete('/:settingId', (req, res) => {
  res.send('Deshabilitar un setting por ID');
});

module.exports = settingsRouter;