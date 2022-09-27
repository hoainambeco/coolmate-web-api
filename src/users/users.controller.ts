import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { UserCreatDto } from "./dto/user-data.dto";

@Controller("users")
@ApiTags("Users")
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

  @Put(":id")
  @ApiResponse({ status: 200, description: "The found record", type: UserDto })
  update(@Param("id") id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiResponse({ status: 200, description: "The found record", type: UserDto })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
