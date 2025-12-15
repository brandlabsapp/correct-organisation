import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PushService } from './push/push.service';
import { EmailService } from './email/email.service';
import { SmsService } from './sms/sms.service';
import { notificationProvider } from './notification.provider';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    PushService,
    EmailService,
    SmsService,
    ...notificationProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
