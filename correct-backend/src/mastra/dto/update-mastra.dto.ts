import { PartialType } from '@nestjs/swagger';
import { CreateMastraDto } from './create-mastra.dto';

export class UpdateMastraDto extends PartialType(CreateMastraDto) {}
