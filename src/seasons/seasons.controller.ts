import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlayersRepository } from 'src/players/players.repository';

@Controller('seasons/:seasonId')
export class SeasonsController {
  constructor(private readonly playersRepository: PlayersRepository) {}

  @Get('players')
  async getPlayersBySeason(@Param('seasonId', ParseIntPipe) seasonId: number) {
    const playerSeasons =
      await this.playersRepository.findPlayerSeasonsBySeason(seasonId);

    return playerSeasons.map((playerSeason) => playerSeason.toResponseObject());
  }

  @Get('players/:playerId')
  async getPlayerBySeason(
    @Param('seasonId', ParseIntPipe) seasonId: number,
    @Param('playerId', ParseIntPipe) playerId: number,
  ) {
    const playerSeason = await this.playersRepository.findPlayerSeason(
      seasonId,
      playerId,
    );

    return playerSeason.toResponseObject();
  }

  @Get('players/:playerId/fixtures')
  async getPlayerFixturesBySeason(
    @Param('seasonId', ParseIntPipe) seasonId: number,
    @Param('playerId', ParseIntPipe) playerId: number,
  ) {
    const playerFixtures = await this.playersRepository.findPlayerFixtures(
      seasonId,
      playerId,
    );

    return playerFixtures.map((playerFixture) =>
      playerFixture.toResponseObject(),
    );
  }
}
