const users = require('./users/users.service.js');
const assistencias = require('./assistencias/assistencias.service.js');
const encomendas = require('./encomendas/encomendas.service.js');
const artigos = require('./artigos/artigos.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(assistencias);
  app.configure(encomendas);
  app.configure(artigos);
};
