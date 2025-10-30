const { Pool } = require('pg');
const path = require('path');

// Load environment variables from per-folder env files
const nodeEnv = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const envPath = path.resolve(__dirname, `../.env.${nodeEnv}`);
require('dotenv').config({ path: envPath });

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT),
  password: process.env.POSTGRES_PASSWORD,
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
  pool
};
