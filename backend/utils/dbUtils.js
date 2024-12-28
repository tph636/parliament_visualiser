const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// Configure your PostgreSQL connection parameters
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD, // If needed
});

// Function to fetch all rows from a query
const fetchAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
};

// Function to fetch the first row from a query
const fetchFirst = (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

module.exports = {
  fetchAll,
  fetchFirst,
};
