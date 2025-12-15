import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '@/user/entity/user.entity';
import { CompanyComplianceTask } from './companyTask.entity';

@Table({ tableName: 'CompanyTaskAssignees', paranoid: true })
export class CompanyTaskAssignee extends Model<CompanyTaskAssignee> {
  @ForeignKey(() => CompanyComplianceTask)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  companyTaskId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
}
