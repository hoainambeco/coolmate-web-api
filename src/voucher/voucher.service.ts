import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateVoucherDto, queryVoucher } from "./dto/create-voucher.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Voucher } from "./entities/voucher.entity";
import { Repository } from "typeorm";
import { ErrorException } from "../exceptions/error.exception";
import { ProductDto } from "../product/dto/product.dto";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
  ) {}
  async create(createVoucherDto: CreateVoucherDto):Promise<Voucher> {
    // console.log(createVoucherDto);
    if (await  this.voucherRepository.findOneBy({code: createVoucherDto.code})) {
      throw  new ErrorException(HttpStatus.BAD_REQUEST, 'Voucher code already exists');
    }
    const voucher = await this.voucherRepository.create(createVoucherDto);
    voucher.used = 0;
    voucher.userId = ObjectId(createVoucherDto.userId) || '';
    return await this.voucherRepository.save(voucher);
  }

  async findAll(query: queryVoucher):Promise<ProductDto[]> {
    let options = {
      where: {},
      order: {}
    };
    if (query.orderBy) {
      options = Object.assign(options, {
        order: {
          [query.orderBy]: query.order
        }
      });
    }
    if (query.status) {
      options = Object.assign(options, {
        where: {
          status: query.status
        }
      });
    }
    if (query.code) {
      options = Object.assign(options, {
        where: {
          code: query.code
        }
      });
    }
    if (query.type) {
      options = Object.assign(options, {
        where: {
          type: query.type
        }
      });
    }
    if (query.userId) {
      options = Object.assign(options, {
        where: {
          userId: ObjectId(query.userId)
        }
      });
    }
    console.log(options);
    const listVoucher = await this.voucherRepository.find(options);
    return JSON.parse(JSON.stringify(listVoucher));
  }

  async findOne(id: string):Promise<ProductDto> {
    console.log(id);
    // @ts-ignore
    const voucher = await this.voucherRepository.findOneBy(id);
    if (!voucher) {
      throw new ErrorException(HttpStatus.NOT_FOUND, 'Voucher not found');
    }
    // @ts-ignore
    return {
      ...voucher,
      id: voucher.id.toString(),
    }
  }
  async findOneByCode(code: string):Promise<ProductDto> {
    // @ts-ignore
    const voucher = await this.voucherRepository.findOneBy({code: code});
    if (!voucher) {
      throw new ErrorException(HttpStatus.NOT_FOUND, 'Voucher not found');
    }
    // @ts-ignore
    return {
      ...voucher,
      id: voucher.id.toString(),
    }
  }

  async update(id: string, updateVoucherDto: CreateVoucherDto) {
    // @ts-ignore
    const voucher = await this.voucherRepository.findOneBy(id);
    if (!voucher) {
      throw new ErrorException(HttpStatus.NOT_FOUND, 'Voucher not found');
    }
    const voucherUpdate = Object.assign(voucher, updateVoucherDto);
    await this.voucherRepository.save(voucherUpdate);
    return {
      ...voucherUpdate,
      id: voucher.id.toString(),
    };
  }

  async remove(id: string) {
    // @ts-ignore
    const voucher = await this.voucherRepository.findOneBy(id);
    if (!voucher) {
      throw new ErrorException(HttpStatus.NOT_FOUND, 'Voucher not found');
    }
return this.voucherRepository.update(id, {status: 'Lưu trữ'});

  }
}
