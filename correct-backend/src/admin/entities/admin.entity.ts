import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../roles/entities/role.entity';
import { AdminRole } from './admin-roles.entity';

@Table({ tableName: 'Admin', paranoid: true })
export class Admin extends Model<Admin> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;

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

  @BelongsToMany(() => Role, { through: () => AdminRole })
  roles: Role[];
}
