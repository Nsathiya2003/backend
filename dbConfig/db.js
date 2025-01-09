import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variables for sensitive data

const ConnectDB = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,     // Username
  process.env.DB_PASSWORD, // Password
  {
    host: process.env.DB_HOST, // Host
    dialect: 'mysql',          // Database dialect
    port: process.env.DB_PORT, // Port (optional, default is 3306)
  }
);

// Test the database connection
ConnectDB.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Unable to connect to the database:', err));

export default ConnectDB;
