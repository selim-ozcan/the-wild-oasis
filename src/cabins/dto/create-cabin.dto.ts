import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

// @Type class-transformer decorator is needed for request payloads that are type of application/form-data
// because form-data, unlike json, always converts everything to string.
export class CreateCabinDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  maxCapacity: number;

  @IsNumber()
  @Type(() => Number)
  regularPrice: number;

  @IsNumber()
  @Type(() => Number)
  discount: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  description: string;
}
