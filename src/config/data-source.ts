require('dotenv').config();
import { DataSource } from 'typeorm';
import config from 'config';

const postgresConfig: Record<string, string | number> = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>('postgresConfig');

export const AppDataSource = new DataSource({
  ...postgresConfig,
  type: 'postgres',
  logging: false,
  synchronize: process.env.NODE_ENV === 'development',
  migrationsRun: true,
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/**/*.{ts,js}']
});

AppDataSource.initialize().catch((err) => {
  console.error('Error during Data Source initialization', err);
});