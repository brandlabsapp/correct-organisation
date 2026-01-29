import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { NotificationObject } from './notification_object.entity';
import { User } from '@/user/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'NotificationChange', paranoid: true })
export class NotificationChange extends Model<NotificationChange> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
    unique: true,
  })
  uuid: string;

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
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
