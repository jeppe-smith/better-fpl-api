import * as Knex from 'knex';
import * as pg from 'pg';
import { Model, knexSnakeCaseMappers } from 'objection';
import { modelProviders } from './model.providers';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
  return parseInt(value);
});

pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => {
  return parseFloat(value);
});

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
  return parseFloat(value);
});

export const databaseProviders: Provider[] = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    inject: [ConfigService],
    async useFactory(configService: ConfigService) {
      const knex = Knex({
        client: 'pg',
        connection: configService.get('DATABASE_URL'),
        debug: configService.get<boolean>('DATABASE_DEBUG'),
        ...knexSnakeCaseMappers(),
      });

      Model.knex(knex);

      return knex;
    },
  },
];
