import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';

import { User } from '@/user/entity/user.entity';
import { Folder } from './folder.entity';
import { v4 as uuidv4 } from 'uuid';
import { Compliance } from '@/company/compliance/entities/compliance.entity';
import { CompanyDetails } from '@/company/entities/company.entity';
import { CompanyMember } from '@/company/entities/company-members.entity';
import { ComplianceDocument } from '@/company/compliance/entities/compliance-document.entity';
import { BelongsToManyAddAssociationMixin } from 'sequelize';

@Table({ tableName: 'Documents', paranoid: true })
export class Document extends Model<Document> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  source: string;

  @Column({
    type: DataType.STRING,
  })
  type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => Folder)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  folderId: number;

  @BelongsTo(() => Folder)
  folder: Folder;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  key: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  filetype: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  extension: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  category: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  tags: string[];

  @Column({
    type: DataType.INTEGER,
  })
  size: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId: number;

  @ForeignKey(() => CompanyDetails)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  companyId: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  indexedAt: Date;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  index: string;

  @ForeignKey(() => CompanyMember)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  companyMemberId: number;

  @BelongsTo(() => CompanyMember)
  companyMember: CompanyMember;

  @BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
  company: CompanyDetails;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;

  @BelongsToMany(() => Compliance, {
    through: () => ComplianceDocument,
    foreignKey: 'documentId',
    otherKey: 'complianceId',
  })
  compliances: Compliance[];

  declare addCompliance: BelongsToManyAddAssociationMixin<Compliance, number>;
}
