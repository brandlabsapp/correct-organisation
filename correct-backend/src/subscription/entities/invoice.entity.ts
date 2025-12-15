import { UUIDV4 } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Subscription } from './subscription.entity';

@Table({ tableName: 'Invoices', paranoid: true })
export class Invoice extends Model<Invoice> {
  @Column({
    type: DataType.UUID,
    defaultValue: () => UUIDV4(),
    primaryKey: true,
  })
  invoiceId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  invoiceUrl: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amountPaid: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  paidAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueDate: Date;

  // @ForeignKey(() => Subscription)
  // @Column({
  //   type: DataType.UUID,
  //   allowNull: true,
  // })
  // subscriptionId: string;

  // @BelongsTo(() => Subscription)
  // subscription: Subscription;
}
