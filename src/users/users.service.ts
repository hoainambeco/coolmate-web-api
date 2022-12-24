import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorite, FavoriteVoucher, User } from "./entities/user.entity";
import { MongoRepository, Repository } from "typeorm";
import { FavoriteDto, UserDto } from "./dto/user.dto";
import { ErrorException } from "../exceptions/error.exception";
import * as bcrypt from "bcrypt";
import { UserCreatDto, UserUpdateDto } from "./dto/user-data.dto";
import { AuthService } from "../auth/auth.service";
import { sendMail } from "../utils/sendMail.util";
import { newUserMailTemplate2, resetPasswordSubject, resetPasswordTemplate } from "./mail.template";
import * as OtpGenerator from "otp-generator";
import { UserChangePasswordDto, UserResetPasswordDto } from "../auth/dto/user-change-password.dto";
import { IFile } from "./file.interface";
import { StatusAccount } from "../enum/status-account";
import { Product } from "../product/entities/product.entity";
import { GoogleLoginDto } from "../auth/dto/google-login.dto";
import { GenderEnum } from "../enum/gender";
import * as mongoose from "mongoose";
import { StatusProductEnum } from "../enum/product";
import { Oder } from "../oders/entities/oder.entity";
import { ShippingStatus } from "../enum/bull";
import { Voucher } from "../voucher/entities/voucher.entity";
import { ObjectId } from "mongodb";
import { format } from "date-fns";

export const userSchema = mongoose.model("users", new mongoose.Schema(User));
// export const billSchema = mongoose.model("bills", new mongoose.Schema(Oder));

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: MongoRepository<Favorite>,
    @InjectRepository(Voucher)
    private readonly voucherRepository: MongoRepository<Voucher>,
    @InjectRepository(FavoriteVoucher)
    private readonly favoriteVoucherRepository: MongoRepository<FavoriteVoucher>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: MongoRepository<User>,
    @InjectRepository(Oder)
    private readonly billRepository: MongoRepository<Oder>
  ) {
  }

  async create(userData: UserCreatDto): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (user) {
      throw new ErrorException(HttpStatus.CONFLICT, "User already exists");
    }

    const otp = await OtpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    const newUser = this.userRepository.create({ ...userData });
    newUser.password = await bcrypt.hashSync(userData.password, 10);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.deletedAt = null;
    newUser.status = StatusAccount.INACTIVE;
    newUser.isCreate = true;
    newUser.role = "user";
    newUser.phone = null;
    newUser.avatar = "uploads/default-avatar.png";
    newUser.otp = await bcrypt.hashSync(otp, 10);
    newUser.phoneActive = StatusAccount.INACTIVE;
    newUser.chatLink = null;
    newUser.registrationToken = null;
    newUser.address = userData.address || null;
    newUser.birthday = new Date(userData.birthday) || null;

    const mailContent = newUserMailTemplate2(userData.fullName, userData.email, otp);
    newUser.role = "user";
    try {
      await sendMail(userData.email, "[CoolMate] THÔNG BÁO KÍCH HOẠT TÀI KHOẢN THÀNH CÔNG", mailContent, ['namxg1@gmail.com','quannm18@gmail.com'], []);
    } catch (error) {
      console.log(error);
    }

    // @ts-ignore
    return {
      ...await this.userRepository.save(newUser),
      id: newUser.id.toString()
    };
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    return JSON.parse(JSON.stringify(users));
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy(id);

    return JSON.parse(JSON.stringify(new UserDto(user)));
  }

  async findOneByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ email });
    return {
      ...user,
      id: user.id.toString()
    };
  }

  async update(user: UserUpdateDto): Promise<UserDto> {
    let users = AuthService.getAuthUser();
    console.log(user);
    users = await Object.assign(users, user);
    if (user.password) {
      users.password = await bcrypt.hashSync(user.password, 10);
    }
    if (user.phoneActive !== StatusAccount.INACTIVE) {
      users.phoneActive = StatusAccount.ACTIVE;
    }
    if(user.birthday){
      users.birthday = new Date(user.birthday);
    }
    await this.userRepository.update(users.id.toString(), users);
    return JSON.parse(JSON.stringify(new UserDto(users)));
  }

  async verifyOtp(otp: { otp: string }): Promise<UserDto> {
    const user = AuthService.getAuthUser();
    const isOtpValid = await bcrypt.compare(otp.otp, user.otp);
    if (isOtpValid) {
      user.isCreate = false;
      user.otp = null;
      user.status = StatusAccount.ACTIVE;
      await this.userRepository.update(user.id.toString(), user);
      return {
        ...user,
        id: user.id.toString()
      };
    }
    throw new ErrorException(HttpStatus.BAD_REQUEST, "OTP is not valid");
  }

  async remove(id: string) {
    const userAdmin = AuthService.getAuthUser();

    if (userAdmin.role !== "admin") {
      throw new ErrorException(HttpStatus.FORBIDDEN, "You are not admin");
    }

    const user = await this.userRepository.findOneBy(id);
    if (!user) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "User not found");
    }
    user.status = StatusAccount.DELETED;
    user.deletedAt = new Date();

    return {
      ...await this.userRepository.save(user),
      id: user.id.toString()
    };
  }

  async isUserExist(options: Partial<{ username: string; email: string }>) {
    const querybuilder = this.userRepository.findBy({ email: options.email });

    return ((await querybuilder).length) > 0;
  }

  async registerUser(userData: UserCreatDto): Promise<UserDto> {
    if (await this.isUserExist({ email: userData.email })) {
      throw new ErrorException(HttpStatus.CONFLICT, "User already exists");
    }
    const otp = await OtpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });
    const newUser = this.userRepository.create({ ...userData });
    newUser.password = await bcrypt.hashSync(userData.password, 10);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.deletedAt = null;
    newUser.status = StatusAccount.INACTIVE;
    newUser.isCreate = true;
    newUser.role = "user";
    newUser.phone = null;
    newUser.avatar = "uploads/default-avatar.png";
    newUser.otp = await bcrypt.hashSync(otp, 10);
    newUser.phoneActive = StatusAccount.INACTIVE;
    newUser.chatLink = null;
    newUser.registrationToken = null;
    newUser.address = userData.address || null;
    newUser.birthday = new Date(userData.birthday) || null;

    const mailContent = newUserMailTemplate2(userData.fullName, userData.email, otp);
    newUser.role = "user";
    try {
      await sendMail(userData.email, "[CoolMate] THÔNG BÁO KÍCH HOẠT TÀI KHOẢN THÀNH CÔNG", mailContent);
    } catch (error) {
      console.log(error);
    }
    return {
      ...await this.userRepository.save(newUser),
      id: newUser.id.toString()
    };
  }

  async createResetOtp(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email }
    });

    if (!user) {
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        "USER_NOT_EXIST"
      );
    }
    const otp =
      await OtpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
      });
    user.otp = await bcrypt.hashSync(otp, 10);
    await this.userRepository.update(user.id, user);

    const mailContent = resetPasswordTemplate(user.fullName, otp);

    try {
      await sendMail(user.email, resetPasswordSubject, mailContent);
    } catch (error) {
      console.log(error);
      throw new ErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "OTP_SEND_MAIL_ERROR"
      );
    }
  }

  async userResetPassword(userData: UserResetPasswordDto): Promise<UserDto> {
    if (
      userData.newPassword !==
      userData.confirmPassword
    ) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH"
      );
    }
    const user = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (!user) {
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        "USER_NOT_EXIST"
      );
    }

    const isOtpValid = await bcrypt.compare(userData.otp, user.otp);
    if (!isOtpValid) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "OTP_INVALID"
      );
    }

    user.password = await bcrypt.hashSync(userData.newPassword, 10);
    user.otp = null;
    await this.userRepository.update(user.id, user);

    return {
      ...user,
      id: user.id.toString()
    };
  }

  async changeAvatar(fileInfo: IFile): Promise<UserDto> {
    const user = AuthService.getAuthUser();
    if (!fileInfo) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "FILE_NOT_FOUND"
      );
    }
    user.avatar = fileInfo.path;
    await this.userRepository.update(user.id.toString(), user);
    return {
      ...user,
      id: user.id.toString()
    };
  }

  async likePost(productId: string): Promise<FavoriteDto> {
    const user = AuthService.getAuthUser();
    // @ts-ignore
    let product = await this.productRepository.findOneBy(productId);
    if (!product) {
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        "PRODUCT_NOT_FOUND"
      );
    }
    const Favorite = await this.favoriteRepository.findOneBy({
      where: {
        userId: user.id,
        productId: product.id.toString()
      }
    });
    console.log(Favorite);
    if (Favorite) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "POST_ALREADY_LIKED");
    }

    const newFavorite = await this.favoriteRepository.create({
      userId: user.id.toString(),
      productId: productId,
      product: product
    });
    await this.favoriteRepository.save(newFavorite);
    return JSON.parse(JSON.stringify(newFavorite));
  }

  async getFavorite(): Promise<FavoriteDto[]> {
    const user = AuthService.getAuthUser();
    const favorites = await this.favoriteRepository.findBy({ userId: user.id });
    console.log(favorites);
    return JSON.parse(JSON.stringify(favorites));
  }

  async getFavoriteByProductId(productId: string): Promise<FavoriteDto> {
    const user = AuthService.getAuthUser();
    const favorites = await this.favoriteRepository.findOneBy({ userId: user.id, productId: productId });
    return JSON.parse(JSON.stringify(favorites));
  }

  async deleteFavorite(productId: string): Promise<FavoriteDto> {
    const user = AuthService.getAuthUser();
    const favorite = await this.favoriteRepository.findOneBy({
      where: {
        userId: user.id,
        productId: productId
      }
    });
    if (!favorite) {
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        "FAVORITE_NOT_FOUND"
      );
    }
    await this.favoriteRepository.delete({ productId: productId, userId: user.id });
    return JSON.parse(JSON.stringify(favorite));
  }

  async google(userEntity: GoogleLoginDto) {
    let user = await this.userRepository.findOneBy({ email: userEntity.email });
    if (!user) {
      const newUser = await this.userRepository.create({
        email: userEntity.email,
        fullName: userEntity.name,
        avatar: userEntity.picture,
        otp: null,
        password: null,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        status: StatusAccount.ACTIVE,
        phoneActive: StatusAccount.INACTIVE,
        isCreate: false,
        gender: GenderEnum.NAM,
        birthday: new Date(1999, 1, 1, 0, 0, 0, 0),
        address: null,
        phone: null,
        chatLink: null,
        registrationToken: null
      });
      user = await this.userRepository.save(newUser);
    }
    return JSON.parse(JSON.stringify(user));
  }

  async statistical(query?: any) {
    const statistical = {
      user: [{_id: null,status:'', count: 0}],
      turnOver: [],
      product:{},
      bill:{},
    }
    console.log(query|| {});
    const user = await userSchema.aggregate([
      {
        $group: {
          _id: "$status",
          status: { $first: "$status" },
          count: { $sum: 1 }
        },
      }]);
    user.sort((a,b) => {
      if(a.count > b.count) return -1;
      if(a.count < b.count) return 1;
      return 0;
    })
    statistical.user = user.map((item) => {
      if (item.status === StatusAccount.ACTIVE) {
        item.status = "Đã kích hoạt";
      }
      if (item.status === StatusAccount.INACTIVE) {
        item.status = "Chưa kích hoạt";
      }
      if (item.status === StatusAccount.DELETED) {
        item.status = "Bị xóa";
      }
      if (item.status === StatusAccount.BAN) {
        item.status = "Bị chặn";
      }
      return item;
    });
    // const product = await productSchema.find({}).sort({createdAt: -1}).limit(5);
    statistical.product = {
      "all": await this.productRepository.count(),
      "CON_HANG": await this.productRepository.countBy({ status: StatusProductEnum.CON_HANG }),
      "HET_HANG": await this.productRepository.countBy({ status: StatusProductEnum.HET_HANG }),
      "NGUNG_KINH_DOANH": await this.productRepository.countBy({ status: StatusProductEnum.NGUNG_KINH_DOANh }),
      "SAP_RA_MAT": await this.productRepository.countBy({ status: StatusProductEnum.SAP_RA_MAT }),
    };
    statistical.bill = {
      "all": await this.billRepository.count(),
      "CHUA_THANH_TOAN": await this.billRepository.countBy({ status: ShippingStatus.CHUA_THANH_TOAN }),
      "DA_THANH_TOAN": await this.billRepository.countBy({ status: ShippingStatus.DA_THANH_TOAN }),
      "CHO_XAC_NHAN": await this.billRepository.countBy({ status: ShippingStatus.CHO_XAC_NHAN }),
      "BI_HUY": await this.billRepository.countBy({ status: ShippingStatus.BI_HUY }),
      "DANG_CHUAN_BI_HANG": await this.billRepository.countBy({ status: ShippingStatus.DANG_CHUAN_BI_HANG }),
      "DANG_VAN_CHUYEN": await this.billRepository.countBy({ status: ShippingStatus.DANG_VAN_CHUYEN }),
      "DA_GIAO_HANG": await this.billRepository.countBy({ status: ShippingStatus.DA_GIAO_HANG }),
      "DA_TRA_HANG": await this.billRepository.countBy({ status: ShippingStatus.DA_TRA_HANG }),
      "DA_NHAN": await this.billRepository.countBy({ status: ShippingStatus.DA_NHAN }),
    };
    statistical.turnOver= [
      {"Jan":await this.getBillInMonth(1),},
      {"Feb":await this.getBillInMonth(2),},
      {"Mar":await this.getBillInMonth(3),},
      {"Apr":await this.getBillInMonth(4),},
      {"May":await this.getBillInMonth(5),},
      {"Jun":await this.getBillInMonth(6),},
      {"Jul":await this.getBillInMonth(7),},
      {"Aug":await this.getBillInMonth(8),},
      {"Sep":await this.getBillInMonth(9),},
      {"Oct":await this.getBillInMonth(10),},
      {"Nov":await this.getBillInMonth(11),},
      {"Dec":await this.getBillInMonth(12),},
    ]
    return statistical
  }

  async changePassword(changePasswordDto: UserChangePasswordDto) {
    const dataUser = AuthService.getAuthUser();
    const user = await this.userRepository.findOneBy({ id: dataUser.id });
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "PASSWORD_INVALID"
      );
    }
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH"
      );
    }
    user.password = await bcrypt.hashSync(changePasswordDto.newPassword, 10);
    await this.userRepository.update(user.id, user);
    return {
      ...user,
      id: user.id.toString()
    };
  }

  async FavoriteVoucherCreate(voucherId: string) {
    const dataUser = AuthService.getAuthUser();
    const user = await this.userRepository.findOneBy(dataUser.id);
    console.log(user);
    const favorite = await this.favoriteVoucherRepository.findOneBy({
      userId: ObjectId(dataUser.id),
      voucherId: voucherId
    });
    if (favorite) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "FAVORITE_VOUCHER_EXISTED"
      );
    }
    const voucher = await this.voucherRepository.findOneBy(voucherId);
    if (!voucher) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "VOUCHER_NOT_FOUND"
      );
    }
    const newFavorite = await this.favoriteVoucherRepository.create({
      userId: user.id,
      voucherId: voucherId,
      voucher: voucher,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    });
    await this.favoriteVoucherRepository.save(newFavorite);
    return JSON.parse(JSON.stringify(newFavorite));
  }
  async FavoriteVoucherCreateByCode(code: string) {
    const dataUser = AuthService.getAuthUser();
    const user = await this.userRepository.findOneBy(dataUser.id);
    console.log(user);
    const voucher = await this.voucherRepository.findOneBy({code: code});
    if (!voucher) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "VOUCHER_NOT_FOUND"
      );
    }
    const favorite = await this.favoriteVoucherRepository.findOneBy({
      userId: ObjectId(dataUser.id),
      voucherId: voucher.id.toString(),
    });
    if (favorite) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "FAVORITE_VOUCHER_EXISTED"
      );
    }

    const newFavorite = await this.favoriteVoucherRepository.create({
      userId: user.id,
      voucherId: voucher.id.toString(),
      voucher: voucher,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    });
    await this.favoriteVoucherRepository.save(newFavorite);
    return JSON.parse(JSON.stringify(newFavorite));
  }

  async FavoriteVoucherDelete(voucherId: string) {
    const dataUser = AuthService.getAuthUser();
    const user = await this.userRepository.findOneBy({ id: dataUser.id });
    const favorite = await this.favoriteVoucherRepository.findOneBy({
      userId: user.id,
      voucherId: voucherId
    }) || await this.favoriteVoucherRepository.findOneBy({
      userId: user.id,
      voucherId: ObjectId(voucherId)
    }) || await this.favoriteVoucherRepository.findOneBy({
      userId: user.id,
      _id: ObjectId(voucherId)
    });
    if (!favorite) {
      throw new ErrorException(
        HttpStatus.BAD_REQUEST,
        "FAVORITE_VOUCHER_NOT_EXISTED"
      );
    }
    await this.favoriteVoucherRepository.delete(favorite.id);
    return JSON.parse(JSON.stringify(favorite));
  }

  async FavoriteVoucherList() {
    const dataUser = AuthService.getAuthUser();
    console.log(dataUser);
    const user = await this.userRepository.findOneBy({ id: dataUser.id.toString() });
    const favorite = await this.favoriteVoucherRepository.findBy({ userId: user.id });
    return JSON.parse(JSON.stringify(favorite));
  }
  async turnOver() {
    const dataUser = AuthService.getAuthUser();
    const user = await this.userRepository.findOneBy({ id: dataUser.id });
    const bill = await this.billRepository.findBy({ userId: user.id });
    const turnOver = bill.reduce((total, item) => {
      return total + item.total;
    }, 0);
    return turnOver;
  }
  async getBillInMonth(month){
    const year = new Date().getFullYear();
    // console.log(year);
    const from = format(new Date(year-1, month, 1), 'yyy-MM-dd')
    const to =format(new Date(month ===12 ? year +1 : year, month===12 ? 1 : month, 1), 'yyy-MM-dd');
    // console.log(new Date(from.toString()));
    // console.log(new Date(to.toString()));
    const bill = await this.billRepository.findBy({createdAt:{$gte:new Date(from.toString()),$lte:new Date(to.toString())}});
    if(bill.length > 0) {
      return bill.map(bill => bill.total).reduce((total, item) => {
        return total + item;
      })
    }
    return 0;
  }
}
