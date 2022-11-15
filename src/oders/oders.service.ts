import { ErrorException } from './../exceptions/error.exception';
import { Repository } from 'typeorm';
import { Oder } from './entities/oder.entity';
import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateOderDto, UpdateShippingStatusDto } from "./dto/create-oder.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from "../voucher/entities/voucher.entity";
import { Cart } from "../cart/entities/cart.entity";

@Injectable()
export class OdersService {
  constructor(
    @InjectRepository(Oder)
    private oderRepository: Repository<Oder>,

    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,

    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async create(createOderDto: CreateOderDto) {
    console.log(createOderDto);
    const oder = await this.oderRepository.create(createOderDto);
    let vouchers = [];
    let carts = [];
    createOderDto.voucherId.map(async (voucherId) => {
      // @ts-ignore
      const voucher = await this.voucherRepository.findOneBy(voucherId);
      console.log(voucher);
      vouchers.push(voucher);
    });
    createOderDto.cartId.map(async (cartId) => {
      // @ts-ignore
      const cart = await this.cartRepository.findOneBy(cartId);
      carts.push(cart);
    });
    console.log(vouchers);
    if(vouchers.length < createOderDto.voucherId.length){
      throw new ErrorException(HttpStatus.NOT_FOUND, 'Voucher not found');
    }
    if(carts.length < createOderDto.cartId.length){
      throw new ErrorException(HttpStatus.NOT_FOUND, 'Cart not found');
    }
    return //this.oderRepository.save(createOderDto);
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
