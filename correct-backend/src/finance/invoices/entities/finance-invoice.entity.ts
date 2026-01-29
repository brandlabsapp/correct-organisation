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
import { FinanceInvoiceLineItem } from './finance-invoice-line-item.entity';
import { FinanceInvoicePayment } from './finance-invoice-payment.entity';
import { FinanceInvoiceActivity } from './finance-invoice-activity.entity';

export enum InvoiceStatus {
	DRAFT = 'draft',
	SENT = 'sent',
	VIEWED = 'viewed',
	PAID = 'paid',
	PARTIALLY_PAID = 'partially_paid',
	OVERDUE = 'overdue',
	CANCELLED = 'cancelled',
}

export enum InvoiceType {
	DOMESTIC = 'domestic', // INV prefix
	EXPORT = 'export', // EXP prefix
}

export enum PaymentTerms {
	DUE_ON_RECEIPT = 'due_on_receipt',
	NET_7 = 'net_7',
	NET_15 = 'net_15',
	NET_30 = 'net_30',
	NET_45 = 'net_45',
	NET_60 = 'net_60',
	CUSTOM = 'custom',
}

@Table({ tableName: 'FinanceInvoices', paranoid: true })
export class FinanceInvoice extends Model<FinanceInvoice> {
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
	clientId: string;

	@ForeignKey(() => Project)
	@Column({
		type: DataType.UUID,
	})
	projectId: string;

	// Invoice Number: INV-FY2526-0001 or EXP-FY2526-0001
	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	invoiceNumber: string;

	@Column({
		type: DataType.ENUM(...Object.values(InvoiceType)),
		defaultValue: InvoiceType.DOMESTIC,
	})
	invoiceType: InvoiceType;

	@Column({
		type: DataType.STRING,
	})
	financialYear: string; // FY2526

	@Column({
		type: DataType.STRING,
		defaultValue: 'Invoice',
	})
	title: string;

	@Column({
		type: DataType.TEXT,
	})
	description: string;

	@Column({
		type: DataType.STRING,
	})
	purchaseOrderNumber: string;

	@Column({
		type: DataType.DATEONLY,
		allowNull: false,
	})
	invoiceDate: Date;

	@Column({
		type: DataType.DATEONLY,
	})
	dueDate: Date;

	@Column({
		type: DataType.ENUM(...Object.values(PaymentTerms)),
		defaultValue: PaymentTerms.NET_30,
	})
	paymentTerms: PaymentTerms;

	@Column({
		type: DataType.ENUM(...Object.values(InvoiceStatus)),
		defaultValue: InvoiceStatus.DRAFT,
	})
	status: InvoiceStatus;

	@Column({
		type: DataType.STRING,
		defaultValue: 'INR',
	})
	currency: string;

	@Column({
		type: DataType.STRING,
		defaultValue: 'en-IN',
	})
	language: string;

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
	discountTotal: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		defaultValue: 0,
	})
	shippingTotal: number;

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
		type: DataType.TEXT,
	})
	footerNotes: string;

	@Column({
		type: DataType.TEXT,
	})
	internalNotes: string;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	isRecurring: boolean;

	@Column({
		type: DataType.UUID,
	})
	recurringProfileId: string;

	@Column({
		type: DataType.STRING,
	})
	pdfUrl: string;

	@Column({
		type: DataType.STRING,
	})
	publicLink: string;

	@Column({
		type: DataType.DATE,
	})
	sentAt: Date;

	@Column({
		type: DataType.DATE,
	})
	viewedAt: Date;

	@Column({
		type: DataType.DATE,
	})
	paidAt: Date;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;

	@BelongsTo(() => FinanceClient, { foreignKey: 'clientId' })
	client: FinanceClient;

	@BelongsTo(() => Project, { foreignKey: 'projectId' })
	project: Project;

	@HasMany(() => FinanceInvoiceLineItem, { foreignKey: 'invoiceId', as: 'lineItems' })
	lineItems: FinanceInvoiceLineItem[];

	@HasMany(() => FinanceInvoicePayment, { foreignKey: 'invoiceId', as: 'payments' })
	payments: FinanceInvoicePayment[];

	@HasMany(() => FinanceInvoiceActivity, { foreignKey: 'invoiceId', as: 'activities' })
	activities: FinanceInvoiceActivity[];
}
