import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsBoolean()
  hasBreakfast: boolean;

  @IsString()
  status: string;

  @IsNumber()
  extrasPrice: number;

  @IsNumber()
  totalPrice: number;
}
