import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Compliance } from './compliance.entity';
import { Document } from '@/vault/entities/document.entity';

@Table({ tableName: 'ComplianceDocuments', paranoid: true })
export class ComplianceDocument extends Model<ComplianceDocument> {
  @ForeignKey(() => Compliance)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  complianceId: number;

  @ForeignKey(() => Document)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  documentId: number;
}
