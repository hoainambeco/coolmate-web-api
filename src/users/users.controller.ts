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
  UseInterceptors, UseGuards, Req, UploadedFile, HttpException
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FavoriteDto, UserDto } from "./dto/user.dto";
import { OtpDto, UserCreatDto, UserUpdateDto } from "./dto/user-data.dto";
import { AuthUserInterceptor } from "../interceptors/auth-user.interceptor";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { extname } from "path";
import { User } from "./entities/user.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';

@Controller("users")
@ApiTags("Users")
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The found record",
    type: UserDto
  })
  create(@Body() createUserDto: UserCreatDto): Promise<UserDto> {
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
  @Post('/change-avatar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'change-avatar',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatar',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Math.round(Date.now() / 1000);
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const imageMimeType = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (!imageMimeType.includes(file.mimetype)) {
          return callback(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async changeAvatar(@UploadedFile() file): Promise<UserDto> {
    return await this.usersService.changeAvatar(file);
  }
  @Put("verify-otp")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "The found record", type: UserDto })
  verify(@Body() otp: OtpDto) {
    return this.usersService.verifyOtp(otp);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: "The found record", type: UserDto })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Post("like/:productId")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: "The found record", type: FavoriteDto })
  like(@Param("productId") productId: string) {
    return this.usersService.likePost(productId);
  }

  @Get("like/favorite")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: "The found record", type: [FavoriteDto] })
  async favorite() {
    return await this.usersService.getFavorite();
  }

  @Get("like/favorite-by-product/:productId")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: "The found record", type: FavoriteDto })
  async getFavoriteByProductId(@Param('productId') productId: string): Promise<FavoriteDto> {
    return await this.usersService.getFavoriteByProductId(productId);
  }


  @Delete("like/:productId")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: "The found record", type: FavoriteDto })
  async unlike(@Param("productId") productId: string) {
    return await this.usersService.deleteFavorite(productId);
  }
}
