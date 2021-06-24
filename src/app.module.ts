import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PlayerSeasonsModule } from './player-seasons/player-seasons.module';

@Module({
  imports: [DatabaseModule, PlayerSeasonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
