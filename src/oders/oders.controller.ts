import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put, UseGuards, UseInterceptors
} from "@nestjs/common";
import { OdersService } from './oders.service';
import { CreateOderByProductDto, CreateOderDto, UpdateShippingStatusDto } from "./dto/create-oder.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthUserInterceptor } from "../interceptors/auth-user.interceptor";

@ApiTags('Oders')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
@Controller('api/oders')
@Controller('oders')
export class OdersController {
  constructor(private readonly odersService: OdersService) {}

  @Post()
  create(@Body() createOderDto: CreateOderDto) {
    return this.odersService.create(createOderDto);
  }
  @Post('create-by-item-carts')
  createByProductId(@Body() createOderDto: CreateOderByProductDto) {
    return this.odersService.createByProductId(createOderDto);
  }
  @Post('create-by-item-carts-v2')
  createByProductIdV2(@Body() createOderDto: CreateOderByProductDto) {
    return this.odersService.createByProductIdV2(createOderDto);
  }

  @Get()
  findAll() {
    return this.odersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.odersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOderDto: CreateOderDto) {
    return this.odersService.update(id, updateOderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.odersService.remove(id);
  }

  @Put('update-shipping-status/:id')
  updateShippingStatus(@Param('id') id: string, @Body() updateShippingStatusDto: UpdateShippingStatusDto){
    return this.odersService.updateShippingStatus(id, updateShippingStatusDto);
  }
}
