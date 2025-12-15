import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Admin } from './admin.entity';
import { Role } from '../../roles/entities/role.entity';

@Table({ tableName: 'AdminRole', paranoid: true })
export class AdminRole extends Model<AdminRole> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;

  @ForeignKey(() => Admin)
  @Column({
    type: DataType.UUID,
  })
  adminId: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
  })
  roleId: string;
}
