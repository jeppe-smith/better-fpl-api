import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlayersRepository } from './players.repository';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersRepository: PlayersRepository) {}

  @Get(':id')
  async getPlayer(@Param('id', ParseIntPipe) id: number) {
    const player = await this.playersRepository.findPlayerById(id);

    return player.toResponseObject();
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
