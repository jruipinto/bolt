// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
  
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    // varchar(45), not null
    nome: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    //bigint(14), unique
    contacto: {
      type: Sequelize.BIGINT(14),
      unique: true
    },
    //text(400)
    endereço: {
      type: Sequelize.TEXT
    },
    //bigint(30)
    nif: {
      type: Sequelize.BIGINT(30)
    },
    //varchar(7), not null
    tipo: {
      type: Sequelize.STRING(7),
      allowNull: false
    },
  
  
    googleId: { type: Sequelize.STRING },
  
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  users.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};
