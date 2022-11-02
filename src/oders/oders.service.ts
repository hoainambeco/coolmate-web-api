import { Injectable } from '@nestjs/common';
import { CreateOderDto } from './dto/create-oder.dto';
import { UpdateOderDto } from './dto/update-oder.dto';

@Injectable()
export class OdersService {
  create(createOderDto: CreateOderDto) {
    return 'This action adds a new oder';
  }

  findAll() {
    return `This action returns all oders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oder`;
  }

  update(id: number, updateOderDto: UpdateOderDto) {
    return `This action updates a #${id} oder`;
  }

  remove(id: number) {
    return `This action removes a #${id} oder`;
  }
}
