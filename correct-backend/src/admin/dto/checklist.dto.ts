import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateChecklistDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsArray()
  @IsNotEmpty()
  complianceIds: number[];

  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsNotEmpty()
  end: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;
}
