import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { AdminRole } from '../../admin/entities/admin-roles.entity';
import { Admin } from '../../admin/entities/admin.entity';

@Table({ tableName: 'Role', paranoid: true })
export class Role extends Model<Role> {
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

  @BelongsToMany(() => Admin, { through: () => AdminRole })
  admins: Admin[];
}
