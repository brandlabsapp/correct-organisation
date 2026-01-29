import { IsArray, IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChecklistDto {
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  complianceIds: number[];
}
