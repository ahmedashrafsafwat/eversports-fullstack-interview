// src/modern/config/index.ts
import path from 'path';

export default {
  server: {
    API_ROUTES_PREFIX: process.env['API_ROUTES_PREFIX'],
    PORT: process.env.PORT || 3000
  },
  api: {
    SPEC_PATH: path.resolve(__dirname, '../modern/api/specs/specs.yaml')
  },
  databases: {
    json: {
      MEMBERSHIP_PATH: path.join(__dirname, '../data/memberships.json'),
      MEMBERSHIP_PERIOD_PATH: path.join(
        __dirname,
        '../data/membership-periods.json'
      )
    },
    // In a real application, you would configure database connection details here
    // For now, we're using JSON files as our data source
    postgresConfig: {
      HOST: process.env['DB_HOST'],
      PORT: process.env['DB_PORT'],
      USERNAME: process.env['DB_USER'],
      PASSWORD: process.env['DB_PASSWORD'],
      DATABASE_NAME: process.env['DB_NAME']
    }
  }
};
