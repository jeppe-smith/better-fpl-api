import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class CreateTransferDTO {
  @IsEnum(['freehit', 'wildcard', null])
  chip!: 'freehit' | 'wildcard' | null;

  @IsInt()
  @IsNotEmpty()
  gameweek_id!: number;

  @IsInt()
  @IsNotEmpty()
  player_in!: number;

  @IsInt()
  @IsNotEmpty()
  player_out!: number;
}
