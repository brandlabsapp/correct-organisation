import { CompanyMember } from '@/company/entities/company-members.entity';
import { CompanyDetails } from '@/company/entities/company.entity';
import { Notification } from '@/notification/entities/notification';
import { NotificationChange } from '@/notification/entities/notification_change.entity';
import { Folder } from '@/vault/entities/folder.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CompanyComplianceTask } from '@/company/compliance/entities/companyTask.entity';
import { CompanyTaskAssignee } from '@/company/compliance/entities/company-task-assignee.entity';

@Table({ tableName: 'Users', paranoid: true })
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  userToken: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  otp: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  otpVerified: boolean;

  @Column({
    type: DataType.DATE,
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  emailNotification: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  pushNotification: boolean;

  @Column({
    type: DataType.STRING,
  })
  deviceToken: string;

  @Column({
    type: DataType.STRING,
  })
  referralCode: string;

  @Column({
    type: DataType.STRING,
  })
  aadhar: string;

  @Column({
    type: DataType.STRING,
  })
  pan: string;

  @HasMany(() => Folder)
  folders: Folder[];

  @HasMany(() => CompanyDetails, { foreignKey: 'userId', as: 'companyDetails' })
  companyDetails: CompanyDetails[];

  @HasMany(() => CompanyMember, { foreignKey: 'userId' })
  companyMembers: CompanyMember[];

  @BelongsToMany(() => CompanyComplianceTask, {
    through: () => CompanyTaskAssignee,
    foreignKey: 'userId',
    otherKey: 'companyTaskId',
  })
  assignedTasks: CompanyComplianceTask[];

  @HasMany(() => NotificationChange, { foreignKey: 'userId' })
  notificationChanges: NotificationChange[];

  @HasMany(() => Notification, { foreignKey: 'notifierId' })
  notifications: Notification[];
}
