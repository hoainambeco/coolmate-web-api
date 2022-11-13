import {HttpStatus, Injectable} from '@nestjs/common';
import {
    CreateProductDto,
    UpdateProductDto,
    Color, rating
} from "./dto/create-product.dto";
import {InjectRepository} from '@nestjs/typeorm';
import {Product} from './entities/product.entity';
import {Repository} from 'typeorm';
import {ProductDto} from './dto/product.dto';
import {ErrorException} from '../exceptions/error.exception';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = await this.productRepository.create(createProductDto);
        product.productCount = product.color.map((color) => color.size.map((size) => size.productCount)).map((item) => item.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
        // console.log(product);
        return product;
    }

    async findAll() {
        const listProducts = await this.productRepository.find({
            order: {updatedAt: 'ASC'},
            skip: 0,
            take: 10,
        });
        return JSON.parse(JSON.stringify(listProducts));
    }

    async findOne(id: string): Promise<ProductDto> {
        // @ts-ignore
        const product = await this.productRepository.findOneBy(id);
        if (!product) {
            throw new ErrorException(HttpStatus.NOT_FOUND, 'Product not found');
        }

        const producttest = await this.productRepository.findBy({
            image: 'string',
        });
        console.log(producttest);

        return {
            ...product,
            id: product.id.toString(),
        };
    }

    async update(id: string, updateProductDto: UpdateProductDto,): Promise<ProductDto> {
        // @ts-ignore
        const product = this.productRepository.findOneBy(id);
        console.log(product);
        if (!product) {
            throw new ErrorException(HttpStatus.NOT_FOUND, 'Product not found');
        }
        await this.productRepository.update(id, updateProductDto);
        return {
            ...product,
            // @ts-ignore
            id: id,
        };
    }

    async remove(id: string) {
        return await this.productRepository.delete(id);
    }

    async createRating(id: string, rating: rating): Promise<ProductDto> {
        // @ts-ignore
        let product = await this.productRepository.findOneBy(id)

        if (!product) {
            throw new ErrorException(HttpStatus.NOT_FOUND, 'Product not found');
        }

        console.log(product);
        try {
            // @ts-ignore
            product.rating.push(rating);
        } catch (e) {
            // @ts-ignore
            product.rating = [rating]
        }
        await this.productRepository.save(product)
        // @ts-ignore
        return rating
    }


}
