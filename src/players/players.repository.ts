import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { PlayerFixtureModel } from 'src/database/models/player-fixture.model';
import { PlayerSeasonModel } from 'src/database/models/player-season.model';

@Injectable()
export class PlayersRepository {
  constructor(
    @Inject(PlayerSeasonModel.name)
    private readonly playerSeasonModel: ModelClass<PlayerSeasonModel>,
  ) {}

  async findPlayerSeason(seasonId: number, id: number) {
    return await this.playerSeasonModel
      .query()
      .findOne({ id, seasonId: seasonId })
      .withGraphFetched('player');
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
