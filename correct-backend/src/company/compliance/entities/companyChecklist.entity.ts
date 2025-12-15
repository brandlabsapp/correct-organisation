import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Compliance } from './compliance.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/user/entity/user.entity';
import { CompanyDetails } from '@/company/entities/company.entity';
import { CompanyComplianceTask } from './companyTask.entity';

@Table({ tableName: 'CompanyChecklists', paranoid: true })
export class CompanyChecklist extends Model<CompanyChecklist> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
    },
  })
  priority: number;

  @ForeignKey(() => Compliance)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  complianceId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'pending',
  })
  status: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId: number;

  @ForeignKey(() => CompanyDetails)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  companyId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;

  @BelongsTo(() => Compliance)
  compliance: Compliance;

  @HasMany(() => CompanyComplianceTask)
  companyComplianceTasks: CompanyComplianceTask[];
}
