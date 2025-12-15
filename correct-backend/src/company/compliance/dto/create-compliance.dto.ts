import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateComplianceDto {
  @IsString()
  title: string;

  @IsString()
  state: string;

  @IsString()
  category: string;

  @IsString()
  applicability: string;

  @IsString()
  purpose: string;

  @IsString()
  dueDateRule: string;

  @IsString()
  penalties: string;

  @IsString()
  section: string;

  @IsString()
  rules: string;
}
