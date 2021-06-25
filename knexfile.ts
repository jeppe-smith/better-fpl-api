import 'dotenv/config';
import * as fs from 'fs';
import * as Knex from 'knex';

module.exports = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { ca: fs.readFileSync(__dirname + '/ca-certificate.crt') },
  },
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
