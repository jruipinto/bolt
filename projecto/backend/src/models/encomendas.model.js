// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
//const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const encomendas = sequelizeClient.define('encomendas', {
    //int, not null
    artigo_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    //int
    assistencia_id: {
      type: Sequelize.INTEGER
    },
    //int
    cliente_user_id: {
      type: Sequelize.INTEGER
    },
    //text(1000)
    observacao: {
      type: Sequelize.TEXT
    },
    //varchar(45), not null
    estado: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    //date, not null
    previsao_entrega: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    //int
    orcamento: {
      type: Sequelize.INTEGER
    },
    //varchar(200)
    fornecedor: {
      type: Sequelize.STRING(200)
    },
    //int
    qty: {
      type: Sequelize.INTEGER
    }

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  encomendas.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return encomendas;
};
