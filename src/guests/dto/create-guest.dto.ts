import { IsString } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  nationality: string;

  @IsString()
  countryFlag: string;

  @IsString()
  nationalId: string;
}
