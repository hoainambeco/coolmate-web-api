import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UseGuards, Put, Query, ValidationPipe
} from "@nestjs/common";
import { ProductService } from './product.service';
import { CreateProductDto, rating, UpdateProductDto } from "./dto/create-product.dto";
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserInterceptor } from '../interceptors/auth-user.interceptor';
import { ProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { QueryProductDto } from "./dto/query-product.dto";
@ApiTags('Product')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductDto,
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [ProductDto],
  })
  async findAll(@Query(new ValidationPipe({ transform: true }))
                  queryProductDto: QueryProductDto,) {
    // console.log(queryProductDto);
    this.productService.updateProduct();
    return await this.productService.findAll(queryProductDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductDto,
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductDto,
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Put('rating/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: rating,
  })
  creatRating(@Param('id') id: string, @Body() rating: rating) {
    return this.productService.createRating(id, rating);
  }
}
