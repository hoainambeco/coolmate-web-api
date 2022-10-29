import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { MongoRepository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { ErrorException } from "../exceptions/error.exception";
import * as bcrypt from "bcrypt";
import { UserCreatDto, UserUpdateDto } from "./dto/user-data.dto";
import { AuthService } from "../auth/auth.service";
import { sendMail } from "../utils/sendMail.util";
import { newUserMailTemplate2, resetPasswordSubject, resetPasswordTemplate } from "./mail.template";
import * as OtpGenerator from "otp-generator";
import { UserResetPasswordDto } from "../auth/dto/user-change-password.dto";
import { IFile } from "./file.interface";
import { StatusAccount } from "../enum/status-account";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>
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

    // @ts-ignore
    const newUser = this.userRepository.create({ ...userData });
    newUser.password = await bcrypt.hashSync(userData.password, 10);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.deletedAt = null;
    newUser.status = StatusAccount.INACTIVE;
    newUser.isCreate = true;
    newUser.role = "user";
    newUser.phone = "";
    newUser.avatar = "";
    newUser.otp = await bcrypt.hashSync(otp, 10);

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
    return users.map((user) => {
      return {
        ...user,
        id: user.id.toString()
      };
    });
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy(id);

    return {
      ...user,
      id: user.id.toString()
    };
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
    users = await Object.assign(users, user);
    users.password = await bcrypt.hashSync(user.password, 10);
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
    newUser.otp = await bcrypt.hashSync(otp, 10);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.deletedAt = null;
    newUser.status = StatusAccount.INACTIVE;
    newUser.isCreate = true;

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
}
