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
    //json, not null
    registo_cronologico: {
      type: Sequelize.JSON,
      allowNull: false
    },
    //varchar(45), not null
    estado: {
      type: Sequelize.STRING(45),
      allowNull: false
      /*
      estados possiveis:
      nova (quando criada numa assistencia mas nao guardada. este estado so existe no frontend. volátil)
      registada
      marcada para ir ao fornecedor
      adquirida (quando se vai ao fornecedor buscar / = "recebido" mas mais especifico)
      esgotada (quando não há mas se adivinha que vai haver e fica pendente)
      sem fornecedor (quando nao se arranja material em lado nenhum)
      aguarda resposta de fornecedor (quando fornecedor fica de dar uma resposta)
      aguarda entrega (quando está comprado)
      recebida
      detectado defeito (igual a "registada", reinicia o processo + contacto pendente de assistencias + criar nota no todo do card)
      entregue
      */
    },
    //date, not null
    previsao_entrega: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    //int
    orcamento: {
      type: Sequelize.DECIMAL(6, 2).UNSIGNED
    },
    //varchar(200)
    fornecedor: {
      type: Sequelize.STRING(200)
    },
    //int
    qty: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
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
