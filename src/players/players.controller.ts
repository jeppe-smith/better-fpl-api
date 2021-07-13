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
}
