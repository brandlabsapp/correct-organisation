import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateCompanyMembersDto {
  @IsNumber()
  companyId: number;
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsString()
  role: string;
  @IsString()
  phone: string;
  @IsString()
  @IsOptional()
  status: string;
  @IsString()
  @IsOptional()
  invitationToken: string;
  @IsDate()
  @IsOptional()
  invitedAt: Date;
  @IsDate()
  @IsOptional()
  acceptedAt: Date;
}
