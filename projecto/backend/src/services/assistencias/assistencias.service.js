// Initializes the `assistencias` service on path `/assistencias`
const createService = require('feathers-sequelize');
const createModel = require('../../models/assistencias.model');
const hooks = require('./assistencias.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/assistencias', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('assistencias');

  service.hooks(hooks);
};
