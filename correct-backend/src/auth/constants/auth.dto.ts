import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class AuthDTO {
  @ApiProperty({
    description: 'User phone number with country code',
    example: '+919999999999',
  })
  phone: string;
}

export class VerifyOtpDTO {
  @ApiProperty({
    description: 'User phone number with country code',
    example: '+919999999999',
  })
  phone: string;

  @ApiProperty({
    description: '6-digit OTP received via SMS',
    example: '123456',
  })
  otp: string;

  @ApiProperty({
    description: 'Optional verification token',
    required: false,
    nullable: true,
  })
  @IsOptional()
  token: string | null;
}
