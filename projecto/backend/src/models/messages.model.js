// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const messages = sequelizeClient.define('messages', {
    //bigint(14), not null
    phoneNumber: {
      type: Sequelize.BIGINT(14),
      allowNull: false
    },
    // varchar(160), not null
    text: {
      type: Sequelize.STRING(160),
      allowNull: false
    },
    // varchar(10), not null
    state: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    deliveredAt: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  messages.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return messages;
};
