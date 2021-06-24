import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { PlayerSeasonModel } from 'src/database/models/player-season.model';

@Injectable()
export class PlayerSeasonsRepository {
  constructor(
    @Inject(PlayerSeasonModel.name)
    private readonly playerSeasonModel: ModelClass<PlayerSeasonModel>,
  ) {}

  findByPlayerCodeAndSeason(playerCode: number, season: number) {
    return this.playerSeasonModel.query().findOne({player_code: playerCode, season})
  }
}
