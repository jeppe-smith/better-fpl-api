import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { PlayerModel } from 'src/database/models/player.model';
import { PlayerSeasonModel } from 'src/database/models/player-season.model';
import { PlayerFixtureModel } from 'src/database/models/player-fixture.model';

@Injectable()
export class PlayersRepository {
  constructor(
    @Inject(PlayerModel.name)
    private readonly playerModel: ModelClass<PlayerModel>,
    @Inject(PlayerSeasonModel.name)
    private readonly playerSeasonModel: ModelClass<PlayerSeasonModel>,
    @Inject(PlayerFixtureModel.name)
    private readonly playerFixtureModel: ModelClass<PlayerFixtureModel>,
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

  async findPlayerFixturesByPlayerId(seasonId: number, playerId: number) {
    const playerSeason = await this.playerSeasonModel
      .query()
      .findOne({ seasonId, playerId })
      .withGraphFetched('fixtures.fixture.[awayTeam.team, homeTeam.team]');

    return playerSeason.fixtures!.sort(
      (a, b) => a.fixture!.gameweekId - b.fixture!.gameweekId,
    );
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

  async findLatestPlayerFixtures(playerId: number, amount: number) {
    return await this.playerFixtureModel
      .query()
      .where({ playerId })
      .joinRelated('fixture')
      .orderBy('fixture.kickoff', 'desc')
      .limit(amount)
      .withGraphFetched('fixture.[awayTeam.team, homeTeam.team]');
  }
}
