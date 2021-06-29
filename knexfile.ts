import 'dotenv/config';
import * as Knex from 'knex';

const base: Knex.Config = {
  client: 'pg',
  debug: true,
  migrations: {
    directory: './src/database/migrations',
    stub: './src/database/etc/migration.stub',
    extension: 'ts',
  },
  seeds: {
    directory: './src/database/seeds',
    stub: './src/database/etc/seed.stub',
    extension: 'ts',
  },
};

module.exports = {
  development: {
    ...base,
    connection: process.env.DATABASE_URL,
  },
  production: {
    ...base,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
  },
} as Knex.Config;
