const db = require('./models');

async function showTables() {
  try {
    // Show all tables
    const [tables] = await db.sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    console.log('Tables in database:');
    tables.forEach(table => {
      console.log(`- ${table.name}`);
    });

    // Show schema for each table
    for (const table of tables) {
      console.log(`\nSchema for ${table.name}:`);
      const [schema] = await db.sequelize.query(`PRAGMA table_info(${table.name})`);
      console.table(schema);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.sequelize.close();
  }
}

showTables();