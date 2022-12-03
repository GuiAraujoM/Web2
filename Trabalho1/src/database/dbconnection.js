const sqlite3 = require('sqlite3');
sqlite3.verbose();

const db = new sqlite3.Database("./src/database/database.db");

module.exports = db;