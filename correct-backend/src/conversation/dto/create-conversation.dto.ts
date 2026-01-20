import { IsNumber, IsOptional } from 'class-validator';
export class CreateConversationDto {
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsNumber()
  @IsOptional()
  companyId: number;
  @IsNumber()
  @IsOptional()
  conversationId: number;
  @IsOptional()
  startDate: Date;
  @IsOptional()
  endDate: Date;
  @IsOptional()
  messages: Record<string, any>[];
}
