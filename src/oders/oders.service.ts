import { ErrorException } from './../exceptions/error.exception';
import { Repository } from 'typeorm';
import { Oder } from './entities/oder.entity';
import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateOderDto, UpdateShippingStatusDto } from "./dto/create-oder.dto";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OdersService {
  constructor(
    @InjectRepository(Oder)
    private oderRepository: Repository<Oder>,
  ) {}

  create(createOderDto: CreateOderDto) {
    console.log(createOderDto);

    return this.oderRepository.save(createOderDto);
  }

  async findAll() {
    const listOders = await this.oderRepository.find({
      order: { updatedAt: 'ASC' },
      skip: 0,
      take: 10,
    });
    console.log(listOders);

    return listOders.map((oder) => {
      return {
        ...oder,
        id: oder.id.toString(),
      };
    });
  }

  async findOne(id: string) {
    // @ts-ignore
    const oder = await this.oderRepository.findOneBy(id);
    if (!oder) {
      throw new ErrorException(HttpStatus.NOT_FOUND, 'Oder not found');
    }
    return {
      ...oder,
      id: oder.id.toString(),
    };
  }

  async update(id: string, updateOderDto: CreateOderDto) {
    // @ts-ignore
    const oder = await this.oderRepository.findOneBy(id);
    if (!oder) {
      throw new ErrorException(HttpStatus.NOT_FOUND, 'Oder not found');
    }
    await this.oderRepository.update(id, updateOderDto);
    return {
      ...oder,
      id: oder.id.toString(),
    };
  }

  async remove(id: string) {
    return await this.oderRepository.delete(id);
  }

  async updateShippingStatus(id: string, updateShippingStatusDto: UpdateShippingStatusDto) {
    // @ts-ignore
    const oder = await this.oderRepository.findOne(id);
    if (!oder) {
      throw new ErrorException(HttpStatus.NOT_FOUND, 'Oder not found');
    }
    oder.shippingStatus = updateShippingStatusDto.shippingStatus;
    await this.oderRepository.save(oder);
    return {
      ...oder,
      id: oder.id.toString(),
    };
  }
}
