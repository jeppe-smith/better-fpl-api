import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './providers/database.providers';

@Global()
@Module({
  providers: databaseProviders,
  exports: databaseProviders,
})
export class DatabaseModule {}
