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

export enum SavedItemType {
	PRODUCT = 'product',
	SERVICE = 'service',
}

@Table({ tableName: 'FinanceSavedItems', paranoid: true })
export class FinanceSavedItem extends Model<FinanceSavedItem> {
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
		type: DataType.ENUM(...Object.values(SavedItemType)),
		defaultValue: SavedItemType.SERVICE,
	})
	itemType: SavedItemType;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.TEXT,
	})
	description: string;

	@Column({
		type: DataType.DECIMAL(15, 2),
		allowNull: false,
	})
	rate: number;

	@Column({
		type: DataType.STRING,
		defaultValue: 'unit',
	})
	unit: string;

	@Column({
		type: DataType.STRING,
	})
	sacCode: string;

	@Column({
		type: DataType.STRING,
	})
	hsnCode: string;

	@Column({
		type: DataType.UUID,
	})
	defaultTaxRateId: string;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	isActive: boolean;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;
}
