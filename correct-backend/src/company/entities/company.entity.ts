import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/user/entity/user.entity';
import { CompanyMember } from './company-members.entity';
import { Conversation } from '@/conversation/entities/conversation.entity';
import { Folder } from '@/vault/entities/folder.entity';
import { Document } from '@/vault/entities/document.entity';
import { CompanyChecklist } from '../compliance/entities/companyChecklist.entity';
@Table({ tableName: 'CompanyDetails', paranoid: true })
export class CompanyDetails extends Model<CompanyDetails> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
    unique: true,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  cin: string;
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  pan: string;
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  gst: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  zip: string;

  @Column({
    type: DataType.STRING,
  })
  city: string;

  @Column({
    type: DataType.STRING,
  })
  state: string;

  @Column({
    type: DataType.STRING,
  })
  country: string;

  @Column({
    type: DataType.STRING,
  })
  industry: string;

  @Column({
    type: DataType.STRING,
  })
  type: string;

  @Column({
    type: DataType.STRING,
  })
  revenue: string;

  @Column({
    type: DataType.INTEGER,
  })
  teamSize: number;

  @Column({
    type: DataType.DATE,
  })
  incorporationDate: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  user: User;

  @HasMany(() => CompanyMember, { foreignKey: 'companyId', as: 'members' })
  members: CompanyMember[];

  @HasMany(() => Conversation)
  conversations: Conversation[];

  @HasMany(() => Folder)
  folders: Folder[];

  @HasMany(() => Document)
  documents: Document[];

  @HasMany(() => CompanyChecklist)
  checklists: CompanyChecklist[];
}
