// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
//const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const assistencias = sequelizeClient.define('assistencias', {
    //int, not null
    cliente_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    //int, not null
    tecnico_user_id: {
      type: Sequelize.JSON,
      allowNull: false
    },
    //varchar(20), not null
    categoria: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    //varchar(20)
    marca: {
      type: Sequelize.STRING(20)
    },
    //varchar(20)
    modelo: {
      type: Sequelize.STRING(20)
    },
    //varchar(20)
    cor: {
      type: Sequelize.STRING(20)
    },
    //varchar(45)
    serial: {
      type: Sequelize.STRING(45)
    },
    //text (2000)
    problema: {
      type: Sequelize.TEXT
    },
    //bigint(8)
    orcamento: {
      type: Sequelize.BIGINT(8)
    },
    //text(5000)
    relatorio_interno: {
      type: Sequelize.TEXT
    },
    //text(1000)
    relatorio_cliente: {
      type: Sequelize.TEXT
    },
    //longtext
    material: {
      type: Sequelize.JSON
    },
    //varchar(8)
    preco: {
      type: Sequelize.STRING(8)
    },
    //varchar(20)
    estado: {
      type: Sequelize.STRING(20)
      /*
      estados possiveis:
      registado
      em transito
      recebido
      em análise
      contacto pendente
      contactado
      orçamento pendente
      aprovado orçamento
      aguarda material
      recebido material
      concluído
      */
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  assistencias.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return assistencias;
};
