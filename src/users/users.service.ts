import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorite, User } from "./entities/user.entity";
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

const userSchema = mongoose.model("users", new mongoose.Schema(User))
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: MongoRepository<Favorite>,
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
      await sendMail(userData.email, "[CoolMate] THÔNG BÁO KÍCH HOẠT TÀI KHOẢN THÀNH CÔNG", mailContent);
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
    await this.userRepository.update(users.id.toString(), users);
    return {
      ...users,
      id: users.id.toString()
    };
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

  async statistical() {
    const statistical = {
      user: [{_id: null,status:'', count: 0}],
      turnOver: {},
      product:{},
      bill:{},
    }
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
}
