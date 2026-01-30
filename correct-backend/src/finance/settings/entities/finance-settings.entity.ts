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

@Table({ tableName: 'FinanceSettings', paranoid: true })
export class FinanceSettings extends Model<FinanceSettings> {
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
		unique: true,
	})
	companyId: number;

	// Defaults
	@Column({
		type: DataType.STRING,
		defaultValue: 'INR',
	})
	defaultCurrency: string;

	@Column({
		type: DataType.STRING,
		defaultValue: 'en-IN',
	})
	defaultLanguage: string;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 30,
	})
	defaultPaymentTerms: number;

	// Tax Settings
	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	enableGst: boolean;

	@Column({
		type: DataType.DECIMAL(5, 2),
		defaultValue: 18,
	})
	defaultGstRate: number;

	// Branding
	@Column({
		type: DataType.STRING,
	})
	logoUrl: string;

	@Column({
		type: DataType.STRING,
	})
	primaryColor: string;

	@Column({
		type: DataType.STRING,
	})
	accentColor: string;

	// Default Notes
	@Column({
		type: DataType.TEXT,
	})
	defaultInvoiceNotes: string;

	@Column({
		type: DataType.TEXT,
	})
	defaultInvoiceFooter: string;

	@Column({
		type: DataType.TEXT,
	})
	defaultEstimateTerms: string;

	// Email Settings
	@Column({
		type: DataType.STRING,
	})
	invoiceEmailSubject: string;

	@Column({
		type: DataType.TEXT,
	})
	invoiceEmailBody: string;

	// Bank Details for invoices
	@Column({
		type: DataType.STRING,
	})
	bankName: string;

	@Column({
		type: DataType.STRING,
	})
	bankAccountName: string;

	@Column({
		type: DataType.STRING,
	})
	bankAccountNumber: string;

	@Column({
		type: DataType.STRING,
	})
	bankIfscCode: string;

	@Column({
		type: DataType.STRING,
	})
	bankSwiftCode: string;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;
}
