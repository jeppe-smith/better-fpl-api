import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlayerSeasonsRepository } from './player-seasons.repository';

@Controller('player-seasons')
export class PlayerSeasonsController {
  constructor(private readonly playerSeasonsRepository: PlayerSeasonsRepository) {}
  
  @Get(':season/:playerCode')
  async findOne(@Param('playerCode', ParseIntPipe) playerCode: number, @Param('season', ParseIntPipe) season: number) {
    const player = await this.playerSeasonsRepository.findByPlayerCodeAndSeason(playerCode, season)

    return {
      playerCode: player.playerCode,
      season: player.season,
      gameweeks: player.gameweeks
    }
  }
}
