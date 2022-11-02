import { ApiProperty } from '@nestjs/swagger';

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
  cartId: [string];

  @ApiProperty()
  voucherId: [string];

  constructor(partial: Partial<OderDto>) {
    Object.assign(this, partial);
  }
}
