import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayersRepository } from './players.repository';
import { SeasonQuery } from './season.query';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersRepository: PlayersRepository) {}

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPlayer(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: SeasonQuery,
  ) {
    const player = await this.playersRepository.findPlayerSeason(
      query.season,
      id,
    );

    return player.toReponseObject();
  }

  @Get(':id/fixtures')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPlayerFixtures(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: SeasonQuery,
  ) {
    const fixtures = await this.playersRepository.findPlayerFixtures(
      query.season,
      id,
    );

    return fixtures.map((fixture) => fixture.toResponseObject());
  }
}
