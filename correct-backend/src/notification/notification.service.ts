import { Inject, Injectable } from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  NOTIFICATION_CHANGE_REPOSITORY,
  NOTIFICATION_OBJECT_REPOSITORY,
  NOTIFICATION_REPOSITORY,
} from '@/core/constants';
import { NotificationObject } from './entities/notification_object.entity';
import { NotificationChange } from './entities/notification_change.entity';
import { Notification } from './entities/notification';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: typeof Notification,
    @Inject(NOTIFICATION_OBJECT_REPOSITORY)
    private readonly notificationObjectRepository: typeof NotificationObject,
    @Inject(NOTIFICATION_CHANGE_REPOSITORY)
    private readonly notificationChangeRepository: typeof NotificationChange,
  ) {}

  async createNotificationObject(data: Notification.NotificationObject) {
    try {
      const notificationObject =
        await this.notificationObjectRepository.create(data);
      return notificationObject;
    } catch (error) {
      throw error;
    }
  }

  async createNotification(data: Notification.Notification) {
    try {
      const notifications = await Promise.all(
        data.notifierId.map(async (notifierId) => {
          return await this.notificationRepository.create({
            ...data,
            notifierId,
          });
        }),
      );

      return notifications;
    } catch (error) {
      throw error;
    }
  }

  async createNotificationChange(
    createNotificationChangeDto: Notification.NotificationChange,
  ) {
    try {
      const notificationChange = await this.notificationChangeRepository.create(
        createNotificationChangeDto,
      );

      return notificationChange;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
