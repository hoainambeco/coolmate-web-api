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
import { QueryOderDto } from "./dto/query-oder.dto";
import { OderDto } from "./dto/oder.dto";
import { newUserMailTemplate2, templateNoticationCreateBill } from "../users/mail.template";
import { sendMail } from "../utils/sendMail.util";
import { StatusProductEnum } from "../enum/product";

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
    // console.log(createOderDto);
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
              if (size.productCount > 0) {
                size.productCount -= quantity;
              } else {
                productSizeCount = size.productCount;
              }
            }
          });
        }
      });
      await this.productRepository.save({ ...product });
    });
    if (productSizeCount > 0) {
      // console.log(productSizeCount);
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
      idPayment: createOderDto.idPayment || "",
      vouchers: vouchers || [],
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
    oder.idPayment = createOderDto.idPayment || "";
    oder.shippingStatus = [{ shippingStatus: ShippingStatus.CHO_XAC_NHAN, note: "", createdAt: new Date() }];
    await this.oderRepository.save(oder);
    return JSON.parse(JSON.stringify(oder));
  }

  async createByProductIdV2(createOderDto: CreateOderByProductDto) {
    let user = AuthService.getAuthUser();
    const oder = await this.oderRepository.create({
      ...createOderDto,
      cartProduct: createOderDto.cartProduct,
      total: 0,
      shippingStatus: [{ shippingStatus: ShippingStatus.CHO_XAC_NHAN, note: "", createdAt: new Date() }]
    });
    let vouchers = [];
    let discount = 0;
    if (createOderDto.voucherId) {
      let errorVoucher;
      createOderDto.voucherId.map(async (voucherId) => {
        if (!RegExp(REGEX.OBJECT_ID).test(voucherId)) {
          errorVoucher = "Voucher id not match";
        }
        // @ts-ignore
        const voucher = await this.voucherRepository.findOneBy(voucherId);
        if (!voucher) {
          errorVoucher = "Voucher not found";
        }
        if (voucher.value <= 0) {
          errorVoucher = "Voucher is used";
        } else {
          voucher.value -= 1;
          voucher.used += 1;
        }
        await this.voucherRepository.save(voucher);
        vouchers.push(voucher);
        discount += voucher.discount;
      });
      if (errorVoucher) {
        throw new ErrorException(HttpStatus.NOT_FOUND, errorVoucher);
      }
      // @ts-ignore
      oder.vouchers = vouchers;
    }
    oder.userId = user.id;
    oder.idPayment = createOderDto.idPayment || "";
    oder.shippingStatus = [{ shippingStatus: ShippingStatus.CHO_XAC_NHAN, note: "", createdAt: new Date() }];
    await this.oderRepository.save(oder);
    await this.updateOrder(oder.id.toString(), discount);
    // @ts-ignore
    await this.sendMail(user, await this.oderRepository.findOneBy(oder.id.toString()));
    return JSON.parse(JSON.stringify(oder));
  }

  async findAll(query: QueryOderDto) {
    const user = AuthService.getAuthUser();
    let option = {
      where: {
        userId: user.id
      },
      order: {}
    };
    if (query.pay) {
      option = Object.assign(option, { where: { ...option.where, status: query.pay } });
    }
    if (query.ship) {
      option = Object.assign(option, {
        where: {
          ...option.where,
          shippingStatus: { $elemMatch: { shippingStatus: query.ship } }
        },
        project: { shippingStatus: { $slice: -1 } }
      });
    }

    // switch (parseInt(query.sort)) {
    //   case 0:
    //     option = Object.assign(option, {order: {updatedAt: "DESC"}});
    //     console.log(option)
    //     break;
    //   case 1:
    //     option = Object.assign(option, {order: {updatedAt: "ASC"}});
    //     break;
    //   case 2:
    //     option = Object.assign(option, {order: {createdAt: "DESC"}});
    //     break;
    //   case 3:
    //     option = Object.assign(option, {order: {createdAt: "ASC"}});
    //     break;
    //   default:
    //     break;
    // }
    // console.log(option);
    const listOders = await this.oderRepository.find(option);
    // console.log(listOders);
    let ListBill: OderDto[];
    ListBill = JSON.parse(JSON.stringify(listOders));
    if (query.ship) {
      ListBill = JSON.parse(JSON.stringify(listOders.map(option => {
        //@ts-ignore
        if (option.shippingStatus[option.shippingStatus.length - 1].shippingStatus == query.ship) {
          return option;
        }
      })));
    }
    var filtered = ListBill.filter(function(el) {
      return el != null;
    });
    return JSON.parse(JSON.stringify(filtered));
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
    const user = AuthService.getAuthUser();
    // @ts-ignore
    const oder = await this.oderRepository.findOne(id);
    if (!oder) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Oder not found");
    }
    // if (updateShippingStatusDto.shippingStatus === ShippingStatus.BI_HUY || updateShippingStatusDto.shippingStatus === ShippingStatus.DA_TRA_HANG) {
    //   // oder.voucherId.map(async (voucherId) => {
    //   //   // @ts-ignore
    //   //   const voucher = await this.voucherRepository.findOneBy(voucherId);
    //   //   if (!voucher) {
    //   //     throw new ErrorException(HttpStatus.NOT_FOUND, "Voucher not found");
    //   //   }
    //   //   voucher.used -= 1;
    //   //   voucher.value += 1;
    //   //   await this.voucherRepository.save(voucher);
    //   //
    //   // });
    //   // @ts-ignore
    //   // oder.carts.carts.map(async (item: ItemCarts) => {
    //   //   // @ts-ignore
    //   //   const product = await this.productRepository.findOneBy(item.products.productId);
    //   //   if (!product) {
    //   //     throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
    //   //   }
    //   //   // @ts-ignore
    //   //   const quantity = item.products.quantity;
    //   //   product.productCount = product.productCount + quantity;
    //   //   product.quantitySold = product.quantitySold - quantity;
    //   //   product.color.map((color) => {
    //   //     // @ts-ignore
    //   //     if (color.name === item.products.colorName) {
    //   //       color.size.map((size) => {
    //   //         // @ts-ignore
    //   //         if (size.name === item.products.sizeName) {
    //   //           size.productCount += quantity;
    //   //         }
    //   //       });
    //   //     }
    //   //   });
    //   //   await this.productRepository.save({ ...product });
    //   // })
    // }
    const mailContent = templateNoticationCreateBill(user.fullName, oder.id.toString(), oder.id.toString(), oder.numberPro, oder.total.toString());
    try {
      await sendMail("coolmate.mail@gmail.com", "[CoolMate] THÔNG BÁO BẠN CÓ ĐƠN HÀNG MỚI CẬP NHẬT", mailContent, ["namxg1@gmail.com"], ["quannmph14304@fpt.edu.vn", "hoainambeco@pimob.onmicrosoft.com"]);
    } catch (error) {
      console.log(error);
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

  async updateOrder(id: string, discount) {
    // @ts-ignore
    const oder = await this.oderRepository.findOneBy(id);
    let oderTotal = 0;
    let CountProduct = 0;
    let productSizeCount = 0;
    let errorProduct;
    oder.cartProduct.map(async (item) => {
      // @ts-ignore
      const product = await this.productRepository.findOneBy(item.productId);
      // console.log(product);
      if (!product) {
        errorProduct = "Product not found";
      }
      if (product.status === StatusProductEnum.HET_HANG) {
        errorProduct = "Product out of stock";
      }
      if (product.productCount <= 0) {
        errorProduct = "Product out of stock";
      }
      const sellingPrice = product.sellingPrice;
      const quantity = item.quantity;
      oderTotal = await (oderTotal + (sellingPrice * quantity));
      oder.total += oderTotal;
      // console.log(oderTotal);
      CountProduct += quantity;
      product.productCount = product.productCount - quantity;
      product.quantitySold = product.quantitySold + quantity;
      product.color.map(async (color) => {
        // @ts-ignore
        if (color.name === product.colorName) {
          color.size.map((size) => {
            // @ts-ignore
            if (size.name === product.sizeName) {
              if (size.productCount > 0) {
                size.productCount -= quantity;
              } else {
                errorProduct = ("Product out of stock");
              }
            }
          });
        }
      });
      // @ts-ignore
      item.product = await JSON.parse(JSON.stringify(product));
      // await this.productRepository.save({ ...product });
    });
    if (errorProduct) {
      console.log(errorProduct);
      await this.oderRepository.delete(id);
      throw new ErrorException(HttpStatus.NOT_FOUND, errorProduct);
    }
    oder.total = await (oder.total - (oder.total * discount / 100));
    return await this.oderRepository.save({
      ...oder,
      total: await this.oderTotal(oder.id.toString(), discount),
      numberPro: oder.cartProduct.length,
      idPayment: oder.idPayment || "",
      shippingStatus: [{ shippingStatus: ShippingStatus.CHO_XAC_NHAN, note: "", createdAt: new Date() }]
    });
  }

  async oderTotal(id: string, discount?: number) {
    let oderTotal = 0;
    let CountProduct = 0;
    let productSizeCount = 0;
    // @ts-ignore
    const oder = await this.oderRepository.findOneBy(id);
    const products = oder.cartProduct;
    for (const item of products) {
      // @ts-ignore
      const product = await this.productRepository.findOneBy(item.productId);
      if (!product) {
        throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
      }
      if (product.productCount <= 0) {
        throw new ErrorException(HttpStatus.NOT_FOUND, "Product is sold out");
      }
      const promotionalPrice = product.promotionalPrice;
      const quantity = item.quantity;
      oderTotal = await (oderTotal + (promotionalPrice * quantity));
      oder.total += oderTotal;
      CountProduct += quantity;
      product.productCount = product.productCount - quantity;
      product.quantitySold = product.quantitySold + quantity;
      product.color.map(async (color) => {
        // @ts-ignore
        if (color.name === product.colorName) {
          color.size.map((size) => {
            // @ts-ignore
            if (size.name === product.sizeName) {
              if (size.productCount > 0) {
                size.productCount -= quantity;
              } else {
                productSizeCount = size.productCount;
              }
            }
          });
        }
      });
    }
    return (oderTotal - discount);
  }

  async sendMail(user, oder) {
    const mailContent = templateNoticationCreateBill(user.fullName, oder.id.toString(), oder.id.toString(), oder.numberPro, oder.total.toString());
    try {
      await sendMail("coolmate.mail@gmail.com", "[CoolMate] THÔNG BÁO BẠN CÓ ĐƠN HÀNG MỚI", mailContent, ["namxg1@gmail.com"], ["quannmph14304@fpt.edu.vn", "hoainambeco@pimob.onmicrosoft.com"]);
      // await sendMail('quannm18@gmail.com', "[CoolMate] THÔNG BÁO BẠN CÓ ĐƠN HÀNG MỚI", mailContent, ['quannm18@gmail.com','namxg1@gmail.com']);
    } catch (error) {
      console.log(error);
    }
  }
}
