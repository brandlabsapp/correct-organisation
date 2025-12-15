import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsJSON,
  IsDate,
} from 'class-validator';

export class CreateNotificationObjectDto {
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  message: string;
  @IsString()
  @IsOptional()
  entityId: string;
  @IsString()
  @IsOptional()
  entityType: string;
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsString()
  @IsOptional()
  status: string;
  @IsString()
  @IsOptional()
  priority: string;
  @IsString()
  @IsOptional()
  frequency: string;
  @IsBoolean()
  @IsOptional()
  persistent: boolean;
  @IsJSON()
  @IsOptional()
  conditions: JSON;
  @IsDate()
  @IsOptional()
  lastSent: Date;
  @IsDate()
  @IsOptional()
  nextSend: Date;
}
