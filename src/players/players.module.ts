import { Module } from '@nestjs/common';
import { PlayersRepository } from './players.repository';
import { PlayersController } from './players.controller';

@Module({
  providers: [PlayersRepository],
  controllers: [PlayersController],
  exports: [PlayersRepository],
})
export class PlayersModule {}
