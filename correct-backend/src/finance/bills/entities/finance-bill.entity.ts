import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CompanyDetails } from '@/company/entities/company.entity';
import { FinanceClient } from '@/finance/clients/entities/finance-client.entity';
import { Project } from '@/projects/entities/project.entity';
import { FinanceBillLineItem } from './finance-bill-line-item.entity';
import { FinanceBillPayment } from './finance-bill-payment.entity';

export enum BillStatus {
	DRAFT = 'draft',
	UNPAID = 'unpaid',
	PAID = 'paid',
	PARTIALLY_PAID = 'partially_paid',
	OVERDUE = 'overdue',
	CANCELLED = 'cancelled',
}

@Table({ tableName: 'FinanceBills', paranoid: true })
export class FinanceBill extends Model<FinanceBill> {
	@Column({
		type: DataType.UUID,
		defaultValue: uuidv4,
		primaryKey: true,
	})
	id: string;

	@ForeignKey(() => CompanyDetails)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	companyId: number;

	@ForeignKey(() => FinanceClient)
	@Column({
		type: DataType.UUID,
	})
	vendorId: string;

	@ForeignKey(() => Project)
	@Column({
		type: DataType.UUID,
	})
	projectId: string;

	// Bill Number: BIL-FY2526-0001
	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	billNumber: string;

	@Column({
		type: DataType.STRING,
	})
	financialYear: string;

	@Column({
		type: DataType.STRING,
	})
	title: string;

	@Column({
		type: DataType.TEXT,
	})
	description: string;

	@Column({
		type: DataType.STRING,
	})
	vendorInvoiceNumber: string;

	@Column({
		type: DataType.DATEONLY,
		allowNull: false,
	})
	billDate: Date;

	@Column({
		type: DataType.DATEONLY,
	})
	dueDate: Date;

	@Column({
		type: DataType.ENUM(...Object.values(BillStatus)),
		defaultValue: BillStatus.DRAFT,
	})
	status: BillStatus;

	@Column({
		type: DataType.STRING,
		defaultValue: 'INR',
	})
	currency: string;

	@Column({
		type: DataType.DECIMAL(15, 2),
		defaultValue: 0,
	})
	subtotal: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		defaultValue: 0,
	})
	taxTotal: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		defaultValue: 0,
	})
	totalAmount: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		defaultValue: 0,
	})
	paidAmount: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		defaultValue: 0,
	})
	balanceDue: number;

	@Column({
		type: DataType.TEXT,
	})
	notes: string;

	@Column({
		type: DataType.STRING,
	})
	attachmentUrl: string;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;

	@BelongsTo(() => FinanceClient, { foreignKey: 'vendorId' })
	vendor: FinanceClient;

	@BelongsTo(() => Project, { foreignKey: 'projectId' })
	project: Project;

	@HasMany(() => FinanceBillLineItem, { foreignKey: 'billId', as: 'lineItems' })
	lineItems: FinanceBillLineItem[];

	@HasMany(() => FinanceBillPayment, { foreignKey: 'billId', as: 'payments' })
	payments: FinanceBillPayment[];
}
