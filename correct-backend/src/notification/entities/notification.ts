import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { NotificationObject } from './notification_object.entity';
import { User } from '@/user/entity/user.entity';

@Table({ tableName: 'Notification', paranoid: true })
export class Notification extends Model<Notification> {
  @ForeignKey(() => NotificationObject)
  @Column({
    type: DataType.INTEGER,
  })
  notificationObjectId: number;

  @BelongsTo(() => NotificationObject)
  notificationObject: NotificationObject;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  notifierId: number;

  @BelongsTo(() => User)
  notifier: User;
}
