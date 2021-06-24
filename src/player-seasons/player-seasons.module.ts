import { Module } from '@nestjs/common';
import { PlayerSeasonsRepository } from './player-seasons.repository';
import { PlayerSeasonsController } from './player-seasons.controller';

@Module({
  providers: [PlayerSeasonsRepository],
  controllers: [PlayerSeasonsController]
})
export class PlayerSeasonsModule {}
