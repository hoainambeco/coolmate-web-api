import { ApiProperty } from '@nestjs/swagger';
import { CartDto } from "../../cart/dto/cart-dto";
import { VoucherDto } from "../../voucher/dto/voucher.dto";
import { Cart } from "../../cart/entities/cart.entity";
import { Voucher } from "../../voucher/entities/voucher.entity";

export class OderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  numberPro: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  placeStore: string;

  @ApiProperty()
  placeCustomer: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  cartId: string;

  @ApiProperty()
  voucherId: [string];

  @ApiProperty()
  carts: Cart;

  @ApiProperty()
  vouchers: [Voucher];

  @ApiProperty()
  shippingStatus:[string];

  constructor(partial: Partial<OderDto>) {
    Object.assign(this, partial);
  }
}
