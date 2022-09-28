import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { MongoRepository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { ErrorException } from "../exceptions/error.exception";
import * as bcrypt from 'bcrypt';
import { UserCreatDto } from "./dto/user-data.dto";

@Injectable()
export class UsersService {
constructor(
  @InjectRepository(User)
  private readonly userRepository: MongoRepository<User>,
) {}

  async create(userData: UserCreatDto): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if ( user) {
      throw new ErrorException(HttpStatus.CONFLICT, "User already exists");
    }
    const newUser = this.userRepository.create({ ...userData });
    newUser.password = await bcrypt.hashSync(userData.password, 10);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.deletedAt = null;
    newUser.isDeleted = false;
    newUser.role = "user";
    newUser.phone = "";
    newUser.avatar = "";
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOneBy(id);
  }
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email: email });
  }
  async update(id: string, user: UserDto) {
    return await this.userRepository.update(id, user);
  }
  async remove(id: string) {
    return await this.userRepository.delete(id);
  }
}
