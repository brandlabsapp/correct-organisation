import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { FinanceEstimate } from './finance-estimate.entity';

@Table({ tableName: 'FinanceEstimateLineItems', paranoid: true })
export class FinanceEstimateLineItem extends Model<FinanceEstimateLineItem> {
	@Column({
		type: DataType.UUID,
		defaultValue: uuidv4,
		primaryKey: true,
	})
	id: string;

	@ForeignKey(() => FinanceEstimate)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	estimateId: string;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	sortOrder: number;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	description: string;

	@Column({
		type: DataType.DECIMAL(15, 4),
		defaultValue: 1,
	})
	quantity: number;

	@Column({
		type: DataType.STRING,
		defaultValue: 'unit',
	})
	unit: string;

	@Column({
		type: DataType.DECIMAL(15, 2),
		allowNull: false,
	})
	rate: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		allowNull: false,
	})
	amount: number;

	@Column({
		type: DataType.STRING,
	})
	sacCode: string;

	@Column({
		type: DataType.STRING,
	})
	hsnCode: string;

	@Column({
		type: DataType.STRING,
	})
	taxName: string;

	@Column({
		type: DataType.DECIMAL(5, 2),
		defaultValue: 0,
	})
	taxRate: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		defaultValue: 0,
	})
	taxAmount: number;

	@Column({
		type: DataType.DECIMAL(5, 2),
		defaultValue: 0,
	})
	discountPercent: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		defaultValue: 0,
	})
	discountAmount: number;

	@Column({
		type: DataType.DECIMAL(15, 2),
		allowNull: false,
	})
	totalAmount: number;

	@Column({
		type: DataType.UUID,
	})
	savedItemId: string;

	@BelongsTo(() => FinanceEstimate, { foreignKey: 'estimateId' })
	estimate: FinanceEstimate;
}
