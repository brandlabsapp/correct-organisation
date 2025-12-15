import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { CompanyChecklist } from './companyChecklist.entity';
import { ComplianceTask } from './task.entity';
import { Document } from '@/vault/entities/document.entity';
import { ComplianceDocument } from './compliance-document.entity';
@Table({ tableName: 'Compliances', paranoid: true })
export class Compliance extends Model<Compliance> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  formId: string;

  @Column({
    type: DataType.STRING,
  })
  state: string;

  @Column({
    type: DataType.STRING,
  })
  category: string;

  @Column({
    type: DataType.STRING,
  })
  applicability: string;

  @Column({
    type: DataType.TEXT,
  })
  purpose: string;

  @Column({
    type: DataType.STRING,
  })
  dueDateRule: string;

  @Column({
    type: DataType.TEXT,
  })
  penalties: string;

  @Column({
    type: DataType.STRING,
  })
  section: string;

  @Column({
    type: DataType.TEXT,
  })
  rules: string;

  @Column({
    type: DataType.STRING,
  })
  recurrence: string;

  @Column({
    type: DataType.TEXT,
  })
  content: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  indexedAt: Date;

  @Column({
    type: DataType.STRING,
  })
  index: string;

  @HasMany(() => CompanyChecklist)
  checklists: CompanyChecklist[];

  @HasMany(() => ComplianceTask)
  tasks: ComplianceTask[];

  @BelongsToMany(() => Document, {
    through: () => ComplianceDocument,
    foreignKey: 'complianceId',
    otherKey: 'documentId',
  })
  docs: Document[];

  declare addDocs: BelongsToManyAddAssociationsMixin<Document, number>;
}
