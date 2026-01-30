import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { FinanceBill } from './finance-bill.entity';
import { PaymentMethod } from '@/finance/invoices/entities/finance-invoice-payment.entity';

@Table({ tableName: 'FinanceBillPayments', paranoid: true })
export class FinanceBillPayment extends Model<FinanceBillPayment> {
	@Column({
		type: DataType.UUID,
		defaultValue: uuidv4,
		primaryKey: true,
	})
	id: string;

	@ForeignKey(() => FinanceBill)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	billId: string;

	@Column({
		type: DataType.DECIMAL(15, 2),
		allowNull: false,
	})
	amount: number;

	@Column({
		type: DataType.DATEONLY,
		allowNull: false,
	})
	paymentDate: Date;

	@Column({
		type: DataType.ENUM(...Object.values(PaymentMethod)),
		defaultValue: PaymentMethod.BANK_TRANSFER,
	})
	paymentMethod: PaymentMethod;

	@Column({
		type: DataType.STRING,
	})
	referenceNumber: string;

	@Column({
		type: DataType.TEXT,
	})
	notes: string;

	@BelongsTo(() => FinanceBill, { foreignKey: 'billId' })
	bill: FinanceBill;
}
