import { BelongsToManySetAssociationsMixin } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/user/entity/user.entity';
import { CompanyDetails } from '@/company/entities/company.entity';
import { ComplianceTask } from './task.entity';
import { CompanyChecklist } from './companyChecklist.entity';
import { CompanyTaskAssignee } from './company-task-assignee.entity';

@Table({ tableName: 'CompanyComplianceTasks', paranoid: true })
export class CompanyComplianceTask extends Model<CompanyComplianceTask> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title: string;

  @ForeignKey(() => CompanyDetails)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  companyId: number;

  @ForeignKey(() => CompanyChecklist)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  companyChecklistId: number;

  @ForeignKey(() => ComplianceTask)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  taskId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  assignedById: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'pending',
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dueDate: Date;

  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;

  @BelongsTo(() => User, 'assignedById')
  assignedBy: User;

  @BelongsToMany(() => User, {
    through: () => CompanyTaskAssignee,
    foreignKey: 'companyTaskId',
    otherKey: 'userId',
  })
  assignedTo: User[];

  declare setAssignedTo: BelongsToManySetAssociationsMixin<User, number>;

  @BelongsTo(() => ComplianceTask)
  task: ComplianceTask;

  @BelongsTo(() => CompanyChecklist)
  companyChecklist: CompanyChecklist;
}
