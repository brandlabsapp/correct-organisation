import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { NotificationChange } from './notification_change.entity';

@Table({ tableName: 'NotificationObject', paranoid: true })
export class NotificationObject extends Model<NotificationObject> {
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  message: string;

  @Column({
    type: DataType.STRING,
  })
  entityId: string;

  @Column({
    type: DataType.ENUM('checklist', 'vault', 'profile'),
  })
  entityType: string;

  @Column({
    type: DataType.STRING,
  })
  status: string;

  @Column({
    type: DataType.ENUM('critical', 'high', 'warning', 'info'),
  })
  priority: string;

  @Column({
    type: DataType.ENUM('daily', 'weekly', 'monthly', 'yearly'),
  })
  frequency: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  persistent: boolean;

  @Column({
    type: DataType.DATE,
  })
  lastSent: Date;

  @Column({
    type: DataType.DATE,
  })
  nextSend: Date;

  @Column({
    type: DataType.JSON,
  })
  conditions: JSON;

  @HasMany(() => NotificationChange, { foreignKey: 'notificationObjectId' })
  notificationChanges: NotificationChange[];
}
