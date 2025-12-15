import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  @IsOptional()
  notificationObjectId: number;
  @IsNumber({}, { each: true })
  @IsOptional()
  @IsArray()
  notifierId: number[];
}
