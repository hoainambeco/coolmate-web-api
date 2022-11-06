import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Voucher } from "./entities/voucher.entity";
import { Repository } from "typeorm";
import { ErrorException } from "../exceptions/error.exception";
import { ProductDto } from "../product/dto/product.dto";

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
    return await this.voucherRepository.save(voucher);
  }

  async findAll() {
    const listVoucher = await this.voucherRepository.find();
    return listVoucher.map((voucher) => {
      return{
        ...voucher,
        id: voucher.id.toString(),
      }
    })
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
return this.voucherRepository.remove(voucher);

  }
}
