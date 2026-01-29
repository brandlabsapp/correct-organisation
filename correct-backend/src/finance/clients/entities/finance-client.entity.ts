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

export enum ClientType {
	CUSTOMER = 'customer',
	VENDOR = 'vendor',
	BOTH = 'both',
}

@Table({ tableName: 'FinanceClients', paranoid: true })
export class FinanceClient extends Model<FinanceClient> {
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

	@Column({
		type: DataType.ENUM(...Object.values(ClientType)),
		defaultValue: ClientType.CUSTOMER,
	})
	clientType: ClientType;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.STRING,
	})
	email: string;

	@Column({
		type: DataType.STRING,
	})
	phone: string;

	@Column({
		type: DataType.STRING,
	})
	contactPerson: string;

	@Column({
		type: DataType.TEXT,
	})
	billingAddress: string;

	@Column({
		type: DataType.STRING,
	})
	city: string;

	@Column({
		type: DataType.STRING,
	})
	state: string;

	@Column({
		type: DataType.STRING,
	})
	country: string;

	@Column({
		type: DataType.STRING,
	})
	postalCode: string;

	@Column({
		type: DataType.STRING,
	})
	gstNumber: string;

	@Column({
		type: DataType.STRING,
	})
	panNumber: string;

	@Column({
		type: DataType.STRING,
	})
	taxId: string;

	@Column({
		type: DataType.STRING,
		defaultValue: 'INR',
	})
	defaultCurrency: string;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 30,
	})
	defaultPaymentTerms: number;

	@Column({
		type: DataType.TEXT,
	})
	notes: string;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	isActive: boolean;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	isArchived: boolean;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;
}
