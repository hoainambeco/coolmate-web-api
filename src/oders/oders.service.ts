import { ErrorException } from "./../exceptions/error.exception";
import { Repository } from "typeorm";
import { Oder } from "./entities/oder.entity";
import { Injectable, HttpStatus } from "@nestjs/common";
import { CreateOderByProductDto, CreateOderDto, UpdateShippingStatusDto } from "./dto/create-oder.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Voucher } from "../voucher/entities/voucher.entity";
import { Carts, ItemCarts } from "../cart/entities/cart.entity";
import { AuthService } from "../auth/auth.service";
import { ShippingStatus } from "../enum/bull";

@Injectable()
export class OdersService {
  constructor(
    @InjectRepository(Oder)
    private oderRepository: Repository<Oder>,

    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,

    @InjectRepository(Carts)
    private cartRepository: Repository<Carts>
  ) {
  }

  async create(createOderDto: CreateOderDto) {
    let user = AuthService.getAuthUser();
    console.log(createOderDto);
    const oder = await this.oderRepository.create({...createOderDto, cartProduct: null});
    let vouchers = [];
    createOderDto.voucherId.map(async (voucherId) => {
      // @ts-ignore
      const voucher = await this.voucherRepository.findOneBy(voucherId);
      if (!voucher) {
        throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher not found");
      }
      // console.log(voucher);
      vouchers.push(voucher);
    });
    // @ts-ignore
    const cart = await this.cartRepository.findOneBy(createOderDto.cartId);
    if (!cart) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Cart not found");
    }
    console.log(cart);
    oder.userId = user.id;
    return await this.oderRepository.save({ ...oder, carts: cart, vouchers: vouchers });
  }
  async createByProductId(createOderDto: CreateOderByProductDto) {
    let user = AuthService.getAuthUser();
    const oder = await this.oderRepository.create({...createOderDto, cartProduct: createOderDto.cartProduct});
    let vouchers = [];
    createOderDto.voucherId.map(async (voucherId) => {
      // @ts-ignore
      const voucher = await this.voucherRepository.findOneBy(voucherId);
      if (!voucher) {
        throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher not found");
      }
      // console.log(voucher);
      vouchers.push(voucher);
    });
    // @ts-ignore
    const cart = await this.cartRepository.findOneBy(createOderDto.cartId);
    if (!cart) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Cart not found");
    }
    console.log(cart);
    oder.userId = user.id;
    return await this.oderRepository.save({ ...oder, carts: cart, vouchers: vouchers });
  }

  async findAll() {
    const listOders = await this.oderRepository.find({
      order: { updatedAt: "ASC" }
    });
    console.log(listOders);
    return JSON.parse(JSON.stringify(listOders));
  }

  async findOne(id: string) {
    // @ts-ignore
    const oder = await this.oderRepository.findOneBy(id);
    if (!oder) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Oder not found");
    }
    return JSON.parse(JSON.stringify(oder))
  }

  async update(id: string, updateOderDto: CreateOderDto) {
    // @ts-ignore
    const oder = await this.oderRepository.findOneBy(id);
    if (!oder) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Oder not found");
    }
    await this.oderRepository.update(id, updateOderDto);
    return JSON.parse(JSON.stringify(oder));
  }

  async remove(id: string) {
    return await this.oderRepository.delete(id);
  }

  async updateShippingStatus(id: string, updateShippingStatusDto: UpdateShippingStatusDto) {
    // @ts-ignore
    const oder = await this.oderRepository.findOne(id);
    if (!oder) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Oder not found");
    }
    oder.shippingStatus = updateShippingStatusDto.shippingStatus;
    await this.oderRepository.save(oder);
    return JSON.parse(JSON.stringify(oder));
  }
}
