// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const configs = sequelizeClient.define('configs', {
    key: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
      /**
       * List of keys:
       *
       * firstTimeConfigured: boolean
       * backendLog: string
       *
       * usesModem: boolean
       * modemPortsList: text
       * modemConnected: boolean
       * modemError: boolean
       * modemLog: string
       */
    },
    value: {
      type: DataTypes.TEXT
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  configs.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return configs;
};
