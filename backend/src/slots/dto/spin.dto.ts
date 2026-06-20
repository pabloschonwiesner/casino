import { IsUUID, IsNumber, Min, Max } from 'class-validator';

export class SpinDto {
  @IsUUID()
  gameId: string;

  @IsNumber()
  @Min(0.1)
  @Max(100)
  betAmount: number;
}
