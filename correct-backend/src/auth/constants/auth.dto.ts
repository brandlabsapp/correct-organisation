import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class AuthDTO {
  @ApiProperty()
  phone: string;
}

export class VerifyOtpDTO {
  @ApiProperty()
  phone: string;
  @ApiProperty()
  otp: string;
  @ApiProperty()
  @IsOptional()
  token: string | null;
}
