import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @IsNumber()
  @IsNotEmpty()
  complianceId: number;

  @IsNumber()
  @IsOptional()
  companyChecklistId?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @IsNumber()
  @IsOptional()
  assignedById?: number;

  @IsOptional()
  assignedToIds?: number[];

  @IsString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  status?: string = 'pending';

  @IsArray()
  @IsOptional()
  documentIds?: number[];
}
