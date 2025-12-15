import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  phone: string;
  @IsString()
  @IsOptional()
  name: string;
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
