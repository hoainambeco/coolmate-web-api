import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UseInterceptors, UseGuards, Req
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDto } from "./dto/user.dto";
import { UserCreatDto, UserUpdateDto } from "./dto/user-data.dto";
import { AuthUserInterceptor } from "../interceptors/auth-user.interceptor";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
@ApiTags("Users")
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK,
    description: "The found record",
    type: UserDto
  })
  create(@Body() createUserDto: UserCreatDto):Promise<UserDto> {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: "The found record", type: [UserDto] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiResponse({ status: 200, description: "The found record", type: UserDto })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: "The found record", type: UserDto })
  update(@Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(updateUserDto);
  }

  @Put('verify-otp')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: "The found record", type: UserDto })
  verify(@Body() otp: {  otp: string }) {
    return this.usersService.verifyOtp(otp);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: "The found record", type: UserDto })
  remove(@Param("id") id: string ) {
    return this.usersService.remove(id);
  }
}
