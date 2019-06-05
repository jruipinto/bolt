// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
//const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const artigos = sequelizeClient.define('artigos', {
    //varchar(45)
    marca: {
      type: Sequelize.STRING(45)
    },
    //varchar(45)
    modelo: {
      type: Sequelize.STRING(45)
    },
    //varchar(255), not null
    descricao: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    //varchar(5)
    localizacao: {
      type: Sequelize.STRING(5)
    },
    //int
    qty: {
      type: Sequelize.INTEGER
    },
    //decimal(6,2) example: 9999,99€
    preco: {
      type: Sequelize.DECIMAL(6, 2)
    },
    //decimal(6,2) example: 9999,99€
    pvp: {
      type: Sequelize.DECIMAL(6, 2)
    }
  },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    });

  // eslint-disable-next-line no-unused-vars
  artigos.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return artigos;
};
