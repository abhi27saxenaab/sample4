const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';

const configs = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  },
  test: {
    dialect: 'sqlite',
    storage: './database_test.sqlite',
    logging: false
  },
  production: {
    dialect: 'sqlite',
    storage: './database_production.sqlite',
    logging: false
  }
};

const config = configs[env];

const sequelize = new Sequelize(config);

module.exports = {
  sequelize,
  configs,
  config
};