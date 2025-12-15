import { PartialType } from '@nestjs/swagger';
import { CreateDinDto } from './create-din.dto';

export class UpdateDinDto extends PartialType(CreateDinDto) {}
