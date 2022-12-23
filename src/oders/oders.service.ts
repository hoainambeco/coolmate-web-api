import { ErrorException } from "../exceptions/error.exception";
import { Oder } from "./entities/oder.entity";
import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateOderByProductDto, CreateOderDto, UpdateShippingStatusDto } from "./dto/create-oder.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Voucher } from "../voucher/entities/voucher.entity";
import { Carts, ItemCarts } from "../cart/entities/cart.entity";
import { AuthService } from "../auth/auth.service";
import { ShippingStatus } from "../enum/bull";
import { Product } from "../product/entities/product.entity";
import { ObjectId } from "mongodb";
import { Repository } from "typeorm";
import { response } from "express";
const REGEX = {
  NOT_DIGIT: /\D+/,
  BUSINESS_CODE: /^[a-zA-Z0-9]{10}$/,
  PHONE: /((09|03|07|08|05)+([0-9]{8})\b)/,
  FAX: /^(\+?\d{1,}(\s?|\\-?)\d*(\s?|\\-?)\(?\d{2,}\)?(\s?|\\-?)\d{3,}\s?\d{3,})$/,
  NAME_COMPANY: /^([a-zA-ZÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴáàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ%&,().+-:\\/;"']+\s)*[a-zA-ZÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴáàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ%&,().+-:\\/;"']+$/,
  FULLNAME: /^([a-zA-ZÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴáàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+\s)*[a-zA-ZÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴáàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+$/,
  FULLNAME_NUMBER: /^([a-zA-Z0-9ÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴáàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+\s)*[a-zA-Z0-9ÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴáàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệiíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+$/,
  EMAIL: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
  OBJECT_ID: /^[0-9a-fA-F]{24}$/
};

@Injectable()
export class OdersService {
  constructor(
    @InjectRepository(Oder)
    private oderRepository: Repository<Oder>,
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    @InjectRepository(Carts)
    private cartRepository: Repository<Carts>,
    @InjectRepository(ItemCarts)
    private itemCartRepository: Repository<ItemCarts>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {
  }

  async create(createOderDto: CreateOderDto) {
    let user = AuthService.getAuthUser();
    console.log(createOderDto);
    const oder = await this.oderRepository.create({ ...createOderDto, cartProduct: null });
    let vouchers = [];
    let discount = 0;
    if (createOderDto.voucherId) {
      createOderDto.voucherId.map(async (voucherId) => {
        if (!RegExp(REGEX.OBJECT_ID).test(voucherId)) {
          throw new ErrorException(HttpStatus.FORBIDDEN, "Voucher id not match");
        }
        // @ts-ignore
        const voucher = await this.voucherRepository.findOneBy(voucherId);
        if (!voucher) {
          throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher not found");
        }
        if (voucher.value <= 0) {
          throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher is used");
        } else {
          voucher.value -= 1;
          voucher.used += 1;
        }
        await this.voucherRepository.save(voucher);
        vouchers.push(voucher);
        discount += voucher.discount;
      });
    }
    if (!RegExp(REGEX.OBJECT_ID).test(createOderDto.cartId)) {
      throw new ErrorException(HttpStatus.FORBIDDEN, "Cart id not match");
    }
    // @ts-ignore
    const cart = await this.cartRepository.findOne({ _id: ObjectId(createOderDto.cartId), user: user._id, status: 'active' });

    if (cart === null || cart === undefined) {
      return new ErrorException(404, "Cart not found");
    }
    let oderTotal = 0;
    let CountProduct = 0;
    let productSizeCount = 0;
    cart.carts.map(async (item: ItemCarts) => {
      // @ts-ignore
      const product = await this.productRepository.findOneBy(item.products.productId);
      if (!product) {
        throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
      }
      // @ts-ignore
      if (product.productCount <= 0) {
        throw new ErrorException(HttpStatus.NOT_FOUND, "Product is sold out");
      }
      // @ts-ignore
      const sellingPrice = item.products.product.sellingPrice;
      // @ts-ignore
      const quantity = item.products.quantity;
      // @ts-ignore
      oderTotal = oderTotal + (sellingPrice * quantity);
      CountProduct += quantity;
      product.productCount = product.productCount - quantity;
      product.quantitySold = product.quantitySold + quantity;
      product.color.map((color) => {
        // @ts-ignore
        if (color.name === item.products.colorName) {
          color.size.map((size) => {
            // @ts-ignore
            if (size.name === item.products.sizeName) {
              if(size.productCount>0){
                size.productCount -= quantity;
              }
              else{
                productSizeCount = size.productCount;
              }
            }
          });
        }
      });
      await this.productRepository.save({ ...product });
    });
    if(productSizeCount>0){
      console.log(productSizeCount);
      throw new ErrorException(HttpStatus.NOT_FOUND, "Product is sold out");
    }
    oder.total = oderTotal - (oderTotal * discount / 100);
    oder.numberPro = cart.carts.length;
    oder.userId = user.id;
    await this.cartRepository.update(cart.id, { ...cart, status: "inactive" });
    await this.oderRepository.save({
      ...oder,
      carts: cart,
      voucherId: createOderDto.voucherId || [],
      idPayment: createOderDto.idPayment || '',
      vouchers: vouchers  || [],
      shippingStatus: [{ shippingStatus: ShippingStatus.CHO_XAC_NHAN, note: "", createdAt: new Date() }]
    });
    return createOderDto;
  }

  async createByProductId(createOderDto: CreateOderByProductDto) {
    let user = AuthService.getAuthUser();
    const oder = await this.oderRepository.create({
      ...createOderDto,
      cartProduct: createOderDto.cartProduct,
      shippingStatus: [{ shippingStatus: ShippingStatus.CHO_XAC_NHAN, note: "", createdAt: new Date() }]
    });
    let vouchers = [];
    let discount = 0;
    if (createOderDto.voucherId) {
      createOderDto.voucherId.map(async (voucherId) => {
        if (!RegExp(REGEX.OBJECT_ID).test(voucherId)) {
          throw new ErrorException(HttpStatus.FORBIDDEN, "Voucher id not match");
        }
        // @ts-ignore
        const voucher = await this.voucherRepository.findOneBy(voucherId);
        if (!voucher) {
          throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher not found");
        }
        if (voucher.value <= 0) {
          throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher is used");
        } else {
          voucher.value -= 1;
          voucher.used += 1;
        }
        await this.voucherRepository.save(voucher);
        vouchers.push(voucher);
        discount += voucher.discount;
      });

      // @ts-ignore
      oder.vouchers = vouchers;
    }
    // if(!createOderDto.cartId){
    //   throw new ErrorException(HttpStatus.NOT_FOUND, "CartID not found");
    // }
    // // @ts-ignore
    // const cart = await this.cartRepository.findOneBy(createOderDto.cartId);
    // if (!cart) {
    //   throw new ErrorException(HttpStatus.NOT_FOUND, "Cart not found");
    // }
    // console.log(cart);
    oder.userId = user.id;
      oder.idPayment=createOderDto.idPayment || '';
      oder.shippingStatus= [{ shippingStatus: ShippingStatus.CHO_XAC_NHAN, note: "", createdAt: new Date() }]
    await this.oderRepository.save(oder)
    return JSON.parse(JSON.stringify(oder));
  }

  async createByProductIdV2(createOderDto: CreateOderByProductDto) {
    let user = AuthService.getAuthUser();
    const oder = await this.oderRepository.create({
      ...createOderDto,
      cartProduct: createOderDto.cartProduct,
      shippingStatus: [{ shippingStatus: ShippingStatus.CHO_XAC_NHAN, note: "", createdAt: new Date() }]
    });
    let vouchers = [];
    let discount = 0;
    if (createOderDto.voucherId) {
      createOderDto.voucherId.map(async (voucherId) => {
        if (!RegExp(REGEX.OBJECT_ID).test(voucherId)) {
          throw new ErrorException(HttpStatus.FORBIDDEN, "Voucher id not match");
        }
        // @ts-ignore
        const voucher = await this.voucherRepository.findOneBy(voucherId);
        if (!voucher) {
          throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher not found");
        }
        if (voucher.value <= 0) {
          throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher is used");
        } else {
          voucher.value -= 1;
          voucher.used += 1;
        }
        await this.voucherRepository.save(voucher);
        vouchers.push(voucher);
        discount += voucher.discount;
      });

      // @ts-ignore
      oder.vouchers = vouchers;
    }
    // if(!createOderDto.cartId){
    //   throw new ErrorException(HttpStatus.NOT_FOUND, "CartID not found");
    // }
    // // @ts-ignore
    // const cart = await this.cartRepository.findOneBy(createOderDto.cartId);
    // if (!cart) {
    //   throw new ErrorException(HttpStatus.NOT_FOUND, "Cart not found");
    // }
    // console.log(cart);
    oder.userId = user.id;
      oder.idPayment=createOderDto.idPayment || '';
      oder.shippingStatus= [{ shippingStatus: ShippingStatus.CHO_XAC_NHAN, note: "", createdAt: new Date() }]
    await this.oderRepository.save(oder)
    return JSON.parse(JSON.stringify(oder));
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
    return JSON.parse(JSON.stringify(oder));
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
    // return await this.oderRepository.delete(id);
    return await this.updateShippingStatus(id, { shippingStatus: ShippingStatus.BI_HUY, note: "Admin hủy đơn hàng" });
  }

  async updateShippingStatus(id: string, updateShippingStatusDto: UpdateShippingStatusDto) {
    // @ts-ignore
    const oder = await this.oderRepository.findOne(id);
    if (!oder) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Oder not found");
    }
    if (updateShippingStatusDto.shippingStatus === ShippingStatus.BI_HUY || updateShippingStatusDto.shippingStatus === ShippingStatus.DA_TRA_HANG) {
      oder.voucherId.map(async (voucherId) => {
        // @ts-ignore
        const voucher = await this.voucherRepository.findOneBy(voucherId);
        if (!voucher) {
          throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher not found");
        }
        voucher.used -= 1;
        voucher.value += 1;
        await this.voucherRepository.save(voucher);
      });
      // @ts-ignore
      oder.carts.carts.map(async (item: ItemCarts) => {
        // @ts-ignore
        const product = await this.productRepository.findOneBy(item.products.productId);
        if (!product) {
          throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
        }
        // @ts-ignore
        const quantity = item.products.quantity;
        product.productCount = product.productCount + quantity;
        product.quantitySold = product.quantitySold - quantity;
        product.color.map((color) => {
          // @ts-ignore
          if (color.name === item.products.colorName) {
            color.size.map((size) => {
              // @ts-ignore
              if (size.name === item.products.sizeName) {
                size.productCount += quantity;
              }
            });
          }
        });
        await this.productRepository.save({ ...product });
      })
    }
    // @ts-ignore
    const check = oder.shippingStatus.find((item) => item.shippingStatus === updateShippingStatusDto.shippingStatus);
    if (!check) {
      oder.shippingStatus.push({ ...updateShippingStatusDto, createdAt: new Date() });
    }
    oder.shippingStatus = [...oder.shippingStatus];
    await this.oderRepository.save(oder);
    return JSON.parse(JSON.stringify(oder));
  }
}
