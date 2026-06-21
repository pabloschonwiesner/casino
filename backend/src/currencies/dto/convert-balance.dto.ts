import { IsString, Length } from 'class-validator';

export class ConvertBalanceDto {
  @IsString()
  @Length(3, 3)
  targetCurrency: string;
}
