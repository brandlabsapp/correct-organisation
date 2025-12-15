import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';
import { checklistProviders } from './checklist.provider';
import { NotificationModule } from '@/notification/notification.module';
import { PushService } from '@/notification/push/push.service';

@Module({
  imports: [NotificationModule],
  providers: [ChecklistService, ...checklistProviders, PushService],
  controllers: [ChecklistController],
  exports: [ChecklistService],
})
export class ChecklistModule {}
