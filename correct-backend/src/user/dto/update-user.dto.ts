import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false, example: '+919999999999' })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email: string;
  @IsString()
  @IsOptional()
  dateOfBirth: Date;
  @IsString()
  @IsOptional()
  address: string;
  @IsString()
  @IsOptional()
  city: string;
  @IsString()
  @IsOptional()
  state: string;
  @IsString()
  @IsOptional()
  country: string;
  @IsString()
  @IsOptional()
  zipCode: string;
  @IsString()
  @IsOptional()
  deviceToken: string;
}
