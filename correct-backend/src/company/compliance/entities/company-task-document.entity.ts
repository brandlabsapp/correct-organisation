import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Document } from '@/vault/entities/document.entity';
import { CompanyComplianceTask } from './companyTask.entity';

@Table({ tableName: 'CompanyTaskDocuments', paranoid: true })
export class CompanyTaskDocument extends Model<CompanyTaskDocument> {
  @ForeignKey(() => CompanyComplianceTask)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  companyTaskId: number;

  @ForeignKey(() => Document)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  documentId: number;
}
