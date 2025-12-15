import { UUIDV4 } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Conversation } from './conversation.entity';
import { Document } from '@/vault/entities/document.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'Messages', paranoid: true })
export class ConversationMessage extends Model<ConversationMessage> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;

  @ForeignKey(() => Conversation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  conversationId: number;

  @BelongsTo(() => Conversation)
  conversation: Conversation;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  userContent: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  botContent: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  role: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resourceId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  threadId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  agentId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  toolCalls: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  toolResults: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  usage: any;

  @ForeignKey(() => Document)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  fileId: number;

  @BelongsTo(() => Document)
  file: Document;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  timestamp: Date;
}
