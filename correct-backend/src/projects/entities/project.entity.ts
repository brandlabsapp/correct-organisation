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

export enum ProjectStatus {
	ACTIVE = 'active',
	COMPLETED = 'completed',
	ON_HOLD = 'on_hold',
	CANCELLED = 'cancelled',
}

@Table({ tableName: 'Projects', paranoid: true })
export class Project extends Model<Project> {
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
		type: DataType.UUID,
	})
	clientId: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.STRING,
	})
	code: string;

	@Column({
		type: DataType.TEXT,
	})
	description: string;

	@Column({
		type: DataType.ENUM(...Object.values(ProjectStatus)),
		defaultValue: ProjectStatus.ACTIVE,
	})
	status: ProjectStatus;

	@Column({
		type: DataType.DATEONLY,
	})
	startDate: Date;

	@Column({
		type: DataType.DATEONLY,
	})
	endDate: Date;

	@Column({
		type: DataType.DECIMAL(15, 2),
	})
	budget: number;

	@Column({
		type: DataType.STRING,
		defaultValue: 'INR',
	})
	currency: string;

	@Column({
		type: DataType.JSONB,
	})
	metadata: object;

	@BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
	company: CompanyDetails;
}
