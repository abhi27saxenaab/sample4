const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config/config.json');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: console.log,
});
async function runManualMigrations() {
    try {
        
        console.log('Running manual migrations...');
        // Create users table
        await sequelize.query(`
        CREATE TABLE categories6 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT
        )
        `);
        await sequelize.query(`
        INSERT INTO categories6 (id,name,description) values 
        ('1','Travel','TEST'),
        ('2','Animals','TEST')
        `);
    } catch (error) {
    console.error('Manual migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

runManualMigrations();