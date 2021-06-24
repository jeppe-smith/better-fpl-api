import { PlayerSeasonModel } from "../models/player-season.model";

export const modelProviders = [PlayerSeasonModel].map((model) => {
  {
    return {
      provide: model.name,
      useValue: model,
    };
  }
});
