import { ApiProperty } from "@nestjs/swagger";
import { Voucher } from "../entities/voucher.entity";

export  class VoucherDto {
   @ApiProperty()
   id: string;

   @ApiProperty()
   condition: string;

   @ApiProperty()
   discount: number;

   @ApiProperty()
   description: string;

   @ApiProperty()
   code: string;

   @ApiProperty()
   type: string;

   @ApiProperty()
   status: string;

   @ApiProperty()
   startDate: Date;

   @ApiProperty()
   endDate: Date;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty()
   updatedAt: Date;

   @ApiProperty()
   deletedAt: Date;

   @ApiProperty()
   isMonopoly: boolean;

   @ApiProperty()
   value: number;

   @ApiProperty()
   userId: string;

   constructor(entity: Voucher) {
      this.id = entity.id.toString();
      this.condition = entity.condition;
      this.discount = entity.discount;
      this.description = entity.description;
      this.code = entity.code;
      this.type = entity.type;
      this.status = entity.status;
      this.startDate = entity.startDate;
      this.endDate = entity.endDate;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
      this.deletedAt = entity.deletedAt;
      this.isMonopoly = entity.isMonopoly;
      this.value = entity.value;
      this.userId = entity.userId;

   }
}