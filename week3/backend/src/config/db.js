const Database = require('better-sqlite3');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbFilePath = process.env.DB_FILE || 'database.sqlite';
const resolvedPath = (dbFilePath === ':memory:' || path.isAbsolute(dbFilePath))
  ? dbFilePath
  : path.join(__dirname, '../../', dbFilePath);

const db = new Database(resolvedPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'completed')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
