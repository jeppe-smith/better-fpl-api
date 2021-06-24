import 'dotenv/config';
import * as Knex from 'knex';

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
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
} as Knex.Config;
