import { User } from '@/user/entity/user.entity';
import { UUIDV4 } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

@Table({ tableName: 'Subscriptions', paranoid: true })
export class Subscription extends Model<Subscription> {
  @Column({
    type: DataType.UUID,
    defaultValue: () => UUIDV4(),
    primaryKey: true,
  })
  subscriptionId: string;

  // @ForeignKey(() => User)
  // @Column({
  //   type: DataType.UUID,
  //   allowNull: false,
  // })
  // userId: string;

  // @BelongsTo(() => User)
  // user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  currentPeriodStart: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  currentPeriodEnd: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  cancelAtPeriodEnd: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  canceledAt: Date;
}
