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

@Table({ tableName: 'FinanceTaxRates', paranoid: true })
export class FinanceTaxRate extends Model<FinanceTaxRate> {
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
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.DECIMAL(5, 2),
		allowNull: false,
	})
	rate: number;

	@Column({
		type: DataType.STRING,
	})
	description: string;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	isDefault: boolean;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	isActive: boolean;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;
}
