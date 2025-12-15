import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  roles: string[];
}

export class LoginAdminDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
