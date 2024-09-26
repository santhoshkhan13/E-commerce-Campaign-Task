const sqlite3 = require('sqlite3').verbose();

// Open the database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Create the products table 
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_name TEXT,
        ad_group_id TEXT,
        fsn_id TEXT,
        product_name TEXT,
        ad_spend REAL,
        views INTEGER,
        clicks INTEGER,
        direct_revenue REAL,
        indirect_revenue REAL,
        direct_units INTEGER,
        indirect_units INTEGER
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Table `products` is ready.');
      }
    });
  }
});

module.exports = db;
