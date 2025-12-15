import { Injectable } from '@nestjs/common';
import { CreateDinDto } from './dto/create-din.dto';
import { UpdateDinDto } from './dto/update-din.dto';

@Injectable()
export class DinService {
  create(createDinDto: CreateDinDto) {
    return 'This action adds a new din';
  }

  findAll() {
    return `This action returns all din`;
  }

  findOne(id: number) {
    return `This action returns a #${id} din`;
  }

  update(id: number, updateDinDto: UpdateDinDto) {
    return `This action updates a #${id} din`;
  }

  remove(id: number) {
    return `This action removes a #${id} din`;
  }
}
