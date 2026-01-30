import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CompanyDetails } from '@/company/entities/company.entity';

/**
 * FinanceSequence - Manages document numbering sequences per financial year
 *
 * Sequence keys follow the pattern: {documentType}_{financialYear}
 * Examples:
 *   - inv_FY2526 (Indian invoices for FY 2025-26)
 *   - exp_FY2526 (Export invoices for FY 2025-26)
 *   - bil_FY2526 (Bills for FY 2025-26)
 *   - est_FY2526 (Estimates for FY 2025-26)
 *
 * This ensures:
 *   - Numbering resets to 1 at the start of each financial year
 *   - Separate sequences for domestic (INV) and export (EXP) invoices
 */
@Table({
	tableName: 'FinanceSequences',
	paranoid: true,
	indexes: [
		{
			unique: true,
			fields: ['companyId', 'sequenceKey'],
		},
	],
})
export class FinanceSequence extends Model<FinanceSequence> {
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
	sequenceKey: string;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 1,
	})
	nextNumber: number;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;
}
