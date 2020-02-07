// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const messages = sequelizeClient.define('messages', {
    //bigint(14), not null
    phoneNumber: {
      type: Sequelize.BIGINT(20),
      allowNull: false
    },
    // varchar(30), not null
    subject: {
      type: Sequelize.STRING(30),
    },
    // varchar(160), not null
    text: {
      type: Sequelize.STRING(160),
      allowNull: false
    },
    // varchar(10), not null
    state: {
      type: Sequelize.STRING(12),
      allowNull: false
      /**
       * Possible states:
       *  for incoming messages:
       *    unread
       *    read
       *  for outgoing messages:
       *    pending (waiting report)
       *    unreachable (report says that address isn´t availble in this moment)
       *    error  (try again. verify modem connected, signal or money balance)
       *    delivered
       */
    },
    tecnico_user_id: {
      type: Sequelize.INTEGER
    },
    submitedAt: {
      type: Sequelize.DATE
      /** submitedAt === deliveryReport.submitTime */
    },
    deliveredAt: {
      type: Sequelize.DATE
      /** deliveredAt === deliveryReport.deliveryTime */
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
