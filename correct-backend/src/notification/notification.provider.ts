import { Notification } from './entities/notification';
import { NotificationObject } from './entities/notification_object.entity';
import { NotificationChange } from './entities/notification_change.entity';
import {
  NOTIFICATION_OBJECT_REPOSITORY,
  NOTIFICATION_REPOSITORY,
  NOTIFICATION_CHANGE_REPOSITORY,
} from '@/core/constants';

export const notificationProvider = [
  {
    provide: NOTIFICATION_REPOSITORY,
    useValue: Notification,
  },
  {
    provide: NOTIFICATION_OBJECT_REPOSITORY,
    useValue: NotificationObject,
  },
  {
    provide: NOTIFICATION_CHANGE_REPOSITORY,
    useValue: NotificationChange,
  },
];
