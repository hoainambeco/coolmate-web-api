import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  UseInterceptors, Put
} from "@nestjs/common";
import { CartService } from './cart.service';
import { CreateCartDto, UpdateItemCartsDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthUserInterceptor } from "../interceptors/auth-user.interceptor";
@ApiTags('cart')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: "The found record", type: CreateCartDto })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('cartsById/:id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Get('cartsByUser/')
  findByUserId() {
    return this.cartService.findByUserId();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
  @Post('delete')
  async postRemove(@Body() id: [string]) {
    return id.map(async (item) => {await this.cartService.remove(item)});
  }
}
@ApiTags('ItemCarts')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
@Controller('api/item-carts')
export class ItemCartsController {
  constructor(private readonly cartService: CartService) {}


  @Get()
  findAllItemCarts() {
    return this.cartService.findAllItemCarts();
  }

  @Put('/:idItemCart')
  updateItemCarts(@Body() updateItemCartsDto: UpdateItemCartsDto, @Param('idItemCart') idItemCart: string){
    return this.cartService.updateItemCarts(updateItemCartsDto, idItemCart);
  }
}
