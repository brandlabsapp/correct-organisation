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
import { ConversationMessage } from './conversationMessages.entity';
import { v4 as uuidv4 } from 'uuid';
import { CompanyDetails } from '@/company/entities/company.entity';

@Table({ tableName: 'Conversations', paranoid: true })
export class Conversation extends Model<Conversation> {
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

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'IN PROGRESS',
  })
  status: 'COMPLETED' | 'IN PROGRESS';

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

  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => ConversationMessage)
  messages: ConversationMessage[];
}
