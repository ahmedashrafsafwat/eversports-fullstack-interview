import dotenv from 'dotenv';
dotenv.config();

export default {
  origin: 'http://localhost:3000',
  API_ROUTES_PREFIX: 'API_ROUTES_PREFIX',
  port: 'PORT',
  postgresConfig: {
    host: process.env['DB_HOST'],
    port: process.env['DB_PORT'],
    username: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME']
  }
};
