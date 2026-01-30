import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { FinanceInvoice } from './finance-invoice.entity';

export enum PaymentMethod {
	CASH = 'cash',
	BANK_TRANSFER = 'bank_transfer',
	UPI = 'upi',
	CHEQUE = 'cheque',
	CARD = 'card',
	OTHER = 'other',
}

@Table({ tableName: 'FinanceInvoicePayments', paranoid: true })
export class FinanceInvoicePayment extends Model<FinanceInvoicePayment> {
	@Column({
		type: DataType.UUID,
		defaultValue: uuidv4,
		primaryKey: true,
	})
	id: string;

	@ForeignKey(() => FinanceInvoice)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	invoiceId: string;

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

	@BelongsTo(() => FinanceInvoice, { foreignKey: 'invoiceId' })
	invoice: FinanceInvoice;
}
