// Initializes the `artigos` service on path `/artigos`
const createService = require('feathers-sequelize');
const createModel = require('../../models/artigos.model');
const hooks = require('./artigos.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/artigos', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('artigos');

  service.hooks(hooks);
};
