import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Compliance } from './compliance.entity';

@Table({ tableName: 'ComplianceTasks', paranoid: true })
export class ComplianceTask extends Model<ComplianceTask> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deadline: string;

  @ForeignKey(() => Compliance)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  complianceId: number;

  @BelongsTo(() => Compliance)
  compliance: Compliance;
}
