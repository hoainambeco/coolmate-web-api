import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("voucher")
export class Voucher {
  @ObjectIdColumn() id: ObjectID;
  @Column({default:null}) condition: string;
  @Column({default:0}) discount: number;
  @Column({default:null}) description: string;
  @Column({default:null}) code: string;
  @Column({default:null}) type: string;
  @Column({default:null}) status: string;
  @Column({default:null}) startDate: Date;
  @Column({default:null}) endDate: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date;
  @Column({default:false}) isMonopoly: boolean;
  @Column({default:0}) value: number;
  @Column({default:null}) userId: string;

  constructor(voucher?: Partial<Voucher>) {
    if (voucher) {
      Object.assign(this, voucher);
    }
  }
}
