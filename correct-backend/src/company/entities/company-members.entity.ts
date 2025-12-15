import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CompanyDetails } from './company.entity';
import { User } from '@/user/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
@Table({ tableName: 'CompanyMembers', paranoid: true })
export class CompanyMember extends Model<CompanyMember> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;
  @ForeignKey(() => CompanyDetails)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  companyId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
  })
  role: string;

  @Column({
    type: DataType.STRING,
  })
  status: string;
  @Column({
    type: DataType.DATE,
  })
  invitedAt: Date;
  @Column({
    type: DataType.DATE,
  })
  acceptedAt: Date;
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  invitationToken: string;

  @Column({
    type: DataType.DATE,
  })
  lastAccessedAt: Date;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  professionalDetails: JSON;

  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;

  @BelongsTo(() => User)
  user: User;
}
