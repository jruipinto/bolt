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
    //int
    tecnico_user_id: {
      type: Sequelize.INTEGER
    },
    //json, not null
    registo_cronologico: {
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
      type: Sequelize.DECIMAL(6, 2).UNSIGNED
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
    //longtext
    encomendas: {
      type: Sequelize.JSON
    },
    //longtext
    messages: {
      type: Sequelize.JSON
    },
    //varchar(8)
    preco: {
      type: Sequelize.DECIMAL(6, 2).UNSIGNED
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
      não atendeu p/ cont.
      cliente adiou resp.
      contactado
      incontactável
      orçamento pendente
      não atendeu p/ orç.
      cliente adiou orç.
      orçamento aprovado
      orçamento recusado
      aguarda material
      material recebido
      concluído
      concluído s/ rep.
      entregue
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
