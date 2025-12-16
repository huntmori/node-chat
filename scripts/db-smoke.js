// Simple DB smoke test using mysql2/promise
// Usage (PowerShell):
// $env:DB_HOST='127.0.0.1'; $env:DB_PORT='3306'; $env:DB_USER='root'; $env:DB_PASSWORD=''; node .\scripts\db-smoke.js

const mysql = require('mysql2/promise');

(async () => {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306', 10) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'node_chat';
  const connectTimeout = parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10) || 10000;

  console.log(`Trying ${user}@${host}:${port} (db=${database}) connectTimeout=${connectTimeout}`);

  const pool = mysql.createPool({ host, port, user, password, database, connectTimeout, waitForConnections: true, connectionLimit: 2 });

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT 1 as ok');
    console.log('DB smoke success:', rows);
    conn.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('DB smoke failed:', err && err.code ? `${err.code} - ${err.message}` : err);
    try { await pool.end(); } catch (e) {}
    process.exit(2);
  }
})();

