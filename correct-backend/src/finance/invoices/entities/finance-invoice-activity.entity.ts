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
import { User } from '@/user/entity/user.entity';

export enum InvoiceActivityType {
	CREATED = 'created',
	UPDATED = 'updated',
	SENT = 'sent',
	VIEWED = 'viewed',
	PAYMENT_RECEIVED = 'payment_received',
	REMINDER_SENT = 'reminder_sent',
	COMMENTED = 'commented',
	STATUS_CHANGED = 'status_changed',
	DOWNLOADED = 'downloaded',
}

@Table({ tableName: 'FinanceInvoiceActivities', paranoid: true })
export class FinanceInvoiceActivity extends Model<FinanceInvoiceActivity> {
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

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
	})
	userId: number;

	@Column({
		type: DataType.ENUM(...Object.values(InvoiceActivityType)),
		allowNull: false,
	})
	activityType: InvoiceActivityType;

	@Column({
		type: DataType.TEXT,
	})
	description: string;

	@Column({
		type: DataType.JSONB,
	})
	metadata: object;

	@BelongsTo(() => FinanceInvoice, { foreignKey: 'invoiceId' })
	invoice: FinanceInvoice;

	@BelongsTo(() => User, { foreignKey: 'userId' })
	user: User;
}
