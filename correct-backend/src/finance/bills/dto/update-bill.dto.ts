import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDto } from './create-bill.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { BillStatus } from '../entities/finance-bill.entity';

export class UpdateBillDto extends PartialType(CreateBillDto) {
	@IsEnum(BillStatus)
	@IsOptional()
	status?: BillStatus;
}
