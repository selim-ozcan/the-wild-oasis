import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class StatisticsFilterDateDto {
  @IsDate()
  @Type(() => Date)
  date: Date;
}
