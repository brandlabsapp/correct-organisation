import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from '@/user/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { integer } from 'aws-sdk/clients/cloudfront';
import { Document } from './document.entity';
import { CompanyDetails } from '@/company/entities/company.entity';

@Table({ tableName: 'Folders', paranoid: true })
export class Folder extends Model<Folder> {
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
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => CompanyDetails)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  companyId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;

  @ForeignKey(() => Folder)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parentId: integer;

  @BelongsTo(() => CompanyDetails, { foreignKey: 'companyId' })
  company: CompanyDetails;

  @BelongsTo(() => Folder, { foreignKey: 'parentId', as: 'parentFolder' })
  parentFolder: Folder;

  @HasMany(() => Folder, { foreignKey: 'parentId', as: 'childFolders' })
  childFolders: Folder[];

  @HasMany(() => Document)
  documents: Document[];
}
