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
import { FinanceInvoice } from '@/finance/invoices/entities/finance-invoice.entity';
import { Project } from '@/projects/entities/project.entity';
import { FinanceEstimateLineItem } from './finance-estimate-line-item.entity';

export enum EstimateStatus {
	DRAFT = 'draft',
	SENT = 'sent',
	VIEWED = 'viewed',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	EXPIRED = 'expired',
}

@Table({ tableName: 'FinanceEstimates', paranoid: true })
export class FinanceEstimate extends Model<FinanceEstimate> {
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

	// Estimate Number: EST-FY2526-0001
	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	estimateNumber: string;

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
		type: DataType.DATEONLY,
		allowNull: false,
	})
	estimateDate: Date;

	@Column({
		type: DataType.DATEONLY,
	})
	expiryDate: Date;

	@Column({
		type: DataType.ENUM(...Object.values(EstimateStatus)),
		defaultValue: EstimateStatus.DRAFT,
	})
	status: EstimateStatus;

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
	discountTotal: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		defaultValue: 0,
	})
	totalAmount: number;

	@Column({
		type: DataType.TEXT,
	})
	notes: string;

	@Column({
		type: DataType.TEXT,
	})
	termsAndConditions: string;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	convertedToInvoice: boolean;

	@ForeignKey(() => FinanceInvoice)
	@Column({
		type: DataType.UUID,
	})
	invoiceId: string;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;

	@BelongsTo(() => FinanceClient, { foreignKey: 'clientId' })
	client: FinanceClient;

	@BelongsTo(() => Project, { foreignKey: 'projectId' })
	project: Project;

	@BelongsTo(() => FinanceInvoice, { foreignKey: 'invoiceId' })
	invoice: FinanceInvoice;

	@HasMany(() => FinanceEstimateLineItem, { foreignKey: 'estimateId', as: 'lineItems' })
	lineItems: FinanceEstimateLineItem[];
}
