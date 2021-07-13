import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PlayersModule } from './players/players.module';
import { SeasonsModule } from './seasons/seasons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PlayersModule,
    SeasonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
