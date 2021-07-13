import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayerFixturesQuery } from './player-fixtures.query';
import { PlayersRepository } from './players.repository';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersRepository: PlayersRepository) {}

  @Get(':id')
  async getPlayer(@Param('id', ParseIntPipe) id: number) {
    const player = await this.playersRepository.findPlayerById(id);

    return player.toResponseObject();
  }

  @Get(':id/latest-fixtures')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getLatestPlayerFixtures(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PlayerFixturesQuery,
  ) {
    const playerFixtures =
      await this.playersRepository.findLatestPlayerFixtures(id, query.amount);

    return playerFixtures.map((playerFixture) =>
      playerFixture.toResponseObject(),
    );
  }

  @Get(':id/seasons/:season/fixtures')
  async getPlayerFixtures(
    @Param('id', ParseIntPipe) id: number,
    @Param('season', ParseIntPipe) season: number,
  ) {
    const playerFixtures =
      await this.playersRepository.findPlayerFixturesByPlayerId(season, id);

    return playerFixtures.map((playerFixture) =>
      playerFixture.toResponseObject(),
    );
  }
}
