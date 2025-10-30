const path = require('path');

// Load environment variables from per-folder env files
// Prefer .env.prod when NODE_ENV=production, otherwise .env.dev
const nodeEnv = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const envPath = path.resolve(__dirname, `../.env.${nodeEnv}`);
require('dotenv').config({ path: envPath });

const PORT = process.env.PORT;

module.exports = {
  PORT,
};
