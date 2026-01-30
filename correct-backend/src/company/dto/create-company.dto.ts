import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
export class CreateCompanyDto {
  @IsString()
  cin: string;
  @IsString()
  @IsOptional()
  pan: string;
  @IsString()
  @IsOptional()
  gst: string;
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  address: string;
  @IsString()
  @IsOptional()
  zip: string;
  @IsString()
  @IsOptional()
  city: string;
  @IsString()
  @IsOptional()
  state: string;
  @IsString()
  @IsOptional()
  country: string;
}

export class VerifyRoleDto {
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsNumber()
  @IsOptional()
  companyId: number;
  @IsString()
  @IsOptional()
  role: string;
  @IsObject()
  @IsOptional()
  data: any;
}
