import {
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
  Table,
  Model,
} from 'sequelize-typescript';
import { CompanyDetails } from '@/company/entities/company.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'Din', paranoid: true })
export class Din extends Model<Din> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  din: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  physicalAddress: string;

  @Column({
    type: DataType.DATE,
  })
  dob: Date;

  @Column({
    type: DataType.DATE,
  })
  appointmentDate: Date;

  @Column({
    type: DataType.DATE,
  })
  cessationDate: Date;

  @ForeignKey(() => CompanyDetails)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  companyId: number;

  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;
}
