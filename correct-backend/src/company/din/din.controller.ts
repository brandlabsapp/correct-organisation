import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DinService } from './din.service';
import { CreateDinDto } from './dto/create-din.dto';
import { UpdateDinDto } from './dto/update-din.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('company')
@Controller('din')
export class DinController {
  constructor(private readonly dinService: DinService) { }

  @Post()
  create(@Body() createDinDto: CreateDinDto) {
    return this.dinService.create(createDinDto);
  }

  @Get()
  findAll() {
    return this.dinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dinService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDinDto: UpdateDinDto) {
    return this.dinService.update(+id, updateDinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dinService.remove(+id);
  }
}
