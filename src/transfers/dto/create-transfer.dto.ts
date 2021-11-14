import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransferDTO {
  @IsEnum(['freehit', 'wildcard', null])
  chip!: 'freehit' | 'wildcard' | null;

  @IsString()
  @IsOptional()
  entry_id!: string;

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
