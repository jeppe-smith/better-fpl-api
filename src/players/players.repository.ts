import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { PlayerSeasonModel } from 'src/database/models/player-season.model';
import { PlayerModel } from 'src/database/models/player.model';

@Injectable()
export class PlayersRepository {
  constructor(
    @Inject(PlayerSeasonModel.name)
    private readonly playerSeasonModel: ModelClass<PlayerSeasonModel>,
    @Inject(PlayerModel.name)
    private readonly playerModel: ModelClass<PlayerModel>,
  ) {}

  async findPlayerById(playerId: number) {
    return await this.playerModel
      .query()
      .findById(playerId)
      .withGraphFetched('seasons');
  }

  async findPlayerSeasonsBySeason(seasonId: number) {
    return await this.playerSeasonModel
      .query()
      .where({ seasonId })
      .orderBy('id', 'ASC')
      .withGraphFetched('player');
  }

  async findPlayerSeason(seasonId: number, id: number) {
    return await this.playerSeasonModel
      .query()
      .findOne({ id, seasonId: seasonId })
      .withGraphFetched('player');
  }

  async findSeasonsForPlayer(id: number) {
    const playerSeasons = await this.playerSeasonModel.query().where({});
  }

  async findPlayerFixtures(seasonId: number, id: number) {
    const player = await this.playerSeasonModel
      .query()
      .findOne({ seasonId, id })
      .withGraphFetched('fixtures.fixture.[awayTeam.team, homeTeam.team]');

    return player.fixtures!.sort(
      (a, b) => a.fixture!.gameweekId - b.fixture!.gameweekId,
    );
  }
}
