const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  MONGODB_URL: process.env.MONGODB_URL,
  NODE_ENV: process.env.NODE_ENV
};