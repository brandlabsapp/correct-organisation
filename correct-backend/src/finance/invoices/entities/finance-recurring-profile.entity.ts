import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CompanyDetails } from '@/company/entities/company.entity';
import { FinanceClient } from '@/finance/clients/entities/finance-client.entity';

export enum RecurringFrequency {
	WEEKLY = 'weekly',
	BIWEEKLY = 'biweekly',
	MONTHLY = 'monthly',
	QUARTERLY = 'quarterly',
	HALF_YEARLY = 'half_yearly',
	YEARLY = 'yearly',
}

export enum RecurringStatus {
	ACTIVE = 'active',
	PAUSED = 'paused',
	COMPLETED = 'completed',
}

@Table({ tableName: 'FinanceRecurringProfiles', paranoid: true })
export class FinanceRecurringProfile extends Model<FinanceRecurringProfile> {
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

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	profileName: string;

	@Column({
		type: DataType.ENUM(...Object.values(RecurringFrequency)),
		defaultValue: RecurringFrequency.MONTHLY,
	})
	frequency: RecurringFrequency;

	@Column({
		type: DataType.ENUM(...Object.values(RecurringStatus)),
		defaultValue: RecurringStatus.ACTIVE,
	})
	status: RecurringStatus;

	@Column({
		type: DataType.DATEONLY,
		allowNull: false,
	})
	startDate: Date;

	@Column({
		type: DataType.DATEONLY,
	})
	endDate: Date;

	@Column({
		type: DataType.DATE,
	})
	nextRun: Date;

	@Column({
		type: DataType.DATE,
	})
	lastRun: Date;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	occurrenceCount: number;

	@Column({
		type: DataType.INTEGER,
	})
	maxOccurrences: number;

	@Column({
		type: DataType.STRING,
		defaultValue: 'domestic',
	})
	invoiceType: string;

	@Column({
		type: DataType.STRING,
		defaultValue: 'INR',
	})
	currency: string;

	@Column({
		type: DataType.STRING,
		defaultValue: 'net_30',
	})
	paymentTerms: string;

	@Column({
		type: DataType.TEXT,
	})
	notes: string;

	@Column({
		type: DataType.TEXT,
	})
	lineItemsJson: string;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	autoSend: boolean;

	@Column({
		type: DataType.INTEGER,
	})
	createdBy: number;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;

	@BelongsTo(() => FinanceClient, { foreignKey: 'clientId' })
	client: FinanceClient;
}
