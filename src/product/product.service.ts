import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "./dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { ProductDto } from "./dto/product.dto";
import { ErrorException } from "../exceptions/error.exception";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  async findAll() {
    const listProducts = await this.productRepository.find({ order: { updatedAt: "ASC" }, skip: 0, take: 10 });
    let products: ProductDto[];
    products = listProducts.map((product) => {
      return {
        id: product.id.toString(),
        type: product.type,
        productName: product.productName,
        image: product.image,
        price: product.price,
        description: product.description,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt,
        isDeleted: product.isDeleted,
        status: product.status,
        PromotionalPrice: product.PromotionalPrice,
        size: product.size,
        rating: product.rating
      };
    });
    return products;
  }

  async findOne(id: string): Promise<ProductDto> {
    // @ts-ignore
    const product = await this.productRepository.findOneBy(id);
    if (!product) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
    }
    return {
      ...product,
      id: product.id.toString()
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto):Promise<ProductDto>{
    // @ts-ignore
    const product = this.productRepository.findOneBy(id);
    console.log(product);
    if (!product) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
    }
    await this.productRepository.update(id, updateProductDto) ;
    return {
      ...product,
      // @ts-ignore
      id: id
    };
  }

  async remove(id: string) {
    return await this.productRepository.delete(id);
  }
}