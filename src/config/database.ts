import mysql from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1q2w3e';
const DB_NAME = process.env.DB_NAME || 'node_chat';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10) || 3306;
const CONNECTION_LIMIT = parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10) || 10;
const CONNECT_TIMEOUT = parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10) || 10000; // ms

const config: DatabaseConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: CONNECTION_LIMIT,
  queueLimit: 0,
};

// Create a connection pool
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.port,
  waitForConnections: config.waitForConnections,
  connectionLimit: config.connectionLimit,
  queueLimit: config.queueLimit,
  connectTimeout: CONNECT_TIMEOUT,
});

// Helper sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Test connection with retries and clearer logging
export const testConnection = async (retries = 3, initialDelay = 500): Promise<void> => {
  let attempt = 0;
  let delay = initialDelay;

  while (attempt < retries) {
    try {
      // Cast pool to any to avoid a spurious "void function return value used" warning
      const connection = await (pool as any).getConnection();
      // Do a lightweight query to validate the connection
      await connection.query('SELECT 1');
      connection.release();
      console.log('✓ MariaDB connected successfully');
      return;
    } catch (error: any) {
      attempt += 1;
      const code = error && (error.code || error.errno) ? (error.code || error.errno) : 'UNKNOWN';
      console.error(`✗ MariaDB connection attempt ${attempt} failed: ${code} - ${error && error.message ? error.message : error}`);

      // Detect specific auth plugin error and provide actionable guidance
      if (code === 'AUTH_SWITCH_PLUGIN_ERROR' || (error && error.message && error.message.includes('auth_gssapi_client'))) {
        console.error('⚠ The server requested an authentication plugin (auth_gssapi_client) that the client does not support.');
        console.error('  For local development, consider changing the DB user to use a native auth plugin (mysql_native_password) or create a new user with native auth.');
        console.error('  Example SQL (run on the DB server as root):');
        console.error("    SELECT user, host, plugin FROM mysql.user;\n");
        console.error("    -- MySQL 8+\n    ALTER USER 'your_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourPasswordHere';\n");
        console.error("    -- MariaDB (if IDENTIFIED WITH is unsupported, use IDENTIFIED VIA/USING PASSWORD or create a user with IDENTIFIED BY):\n    CREATE USER 'node'@'localhost' IDENTIFIED BY 'YourPasswordHere';\n    GRANT ALL PRIVILEGES ON node_chat.* TO 'node'@'localhost';");
      }

      if (attempt >= retries) {
        console.error('✗ MariaDB connection failed after retries');
        throw error;
      }

      // Backoff before retrying
      await sleep(delay);
      delay *= 2;
    }
  }
};

export default pool;
