import { Module } from '@nestjs/common';
import { PlayersModule } from 'src/players/players.module';
import { SeasonsController } from './seasons.controller';

@Module({
  imports: [PlayersModule],
  controllers: [SeasonsController],
})
export class SeasonsModule {}
