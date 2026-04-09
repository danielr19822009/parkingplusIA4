const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST || process.env.DB_HOST,
  user: process.env.MYSQL_ADDON_USER || process.env.DB_USER,
  password: process.env.MYSQL_ADDON_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQL_ADDON_DB || process.env.DB_NAME,
  port: process.env.MYSQL_ADDON_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
