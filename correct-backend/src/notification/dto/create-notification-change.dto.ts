import { IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationChangeDto {
  @IsNumber()
  @IsOptional()
  notificationObjectId: number;
  @IsNumber()
  @IsOptional()
  userId: number;
}
