import { Module } from '@nestjs/common';
import { PlayersRepository } from './players.repository';
import { PlayersController } from './players.controller';

@Module({
  providers: [PlayersRepository],
  controllers: [PlayersController],
})
export class PlayersModule {}
