import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    description: 'User phone number with country code',
    example: '+919999999999',
  })
  phone: string;
}
