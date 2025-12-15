import { IsNumber, IsOptional } from 'class-validator';
export class CreateConversationDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  companyId: number;
  @IsNumber()
  @IsOptional()
  converastionId: number;
  @IsOptional()
  startDate: Date;
  @IsOptional()
  endDate: Date;
  @IsOptional()
  messages: Record<string, any>[];
}
