import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

// @Type class-transformer decorator is needed for request payloads that are type of application/form-data
// because form-data, unlike json, always converts everything to string.
export class CreateSettingDto {
  @IsNumber()
  @Type(() => Number)
  minBookingLength: number;

  @IsNumber()
  @Type(() => Number)
  maxBookingLength: number;

  @IsNumber()
  @Type(() => Number)
  maxGuestsPerBooking: number;

  @IsNumber()
  @Type(() => Number)
  breakfastPrice: number;
}
