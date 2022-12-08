import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateProductDto, rating, UpdateProductDto } from "./dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { MongoRepository, Repository } from "typeorm";
import { ProductDto } from "./dto/product.dto";
import { ErrorException } from "../exceptions/error.exception";
import { User } from "../users/entities/user.entity";
import { getMessaging } from "firebase-admin/messaging";
import { QueryProductDto } from "./dto/query-product.dto";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { AuthUser } from "../decorators/auth-user.decorator";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>
  ) {
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.create(createProductDto);
    product.productCount = product.color.map((color) => color.size.map((size) => size.productCount)).map((item) => item.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
    product.image = product.color.map((color) => color.image.map((image) => image)).map((item) => item.reduce((a, b) => a.concat(b), [])).reduce((a, b) => a.concat(b), []);
    await this.productRepository.save(product);
    const user = await this.userRepository.find();
    // for (const item of user) {
    //   if (!item.registrationToken) {
    //     item.registrationToken = "fmVvbYa5TLeE_cAwprIbFA:APA91bH-7t8CJRr-b1PRAHh_i1nmg4Xd76RLCvi0_NyWhOiX_cMGtm0HBOe6jC4B1Ieb1VnqSjWupSNx4Z3yiRg4IxvhLxwdVEPN5KHb0QKQLuhZ_TwozsDqvjnxehc-M3h30asWeX5m";
    //     await this.userRepository.save(item);
    //   }
    // }
    const registrationToken = [...new Set(user.map((item) => item.registrationToken))];
    console.log(registrationToken);
    registrationToken.forEach((item) => {
      const message = {
        android: {
          notification: {
            title: "New Product",
            body: "New Product has been added",
            imageUrl: product.image[0]
          }
        },
        tokens: [item]
      };
      getMessaging().sendMulticast(message)
        .then((response) => {
            console.log("Successfully sent message:", response);
          }
        )
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    });

    return product;
  }

  async updateProduct() {
    const products = await this.productRepository.find();
    products.map(async (element) => {
      const item = { ...element };
      item.image = item.color.map((color) => color.image.map((image) => image)).map((item) => item.reduce((a, b) => a.concat(b), [])).reduce((a, b) => a.concat(b), []);
      try {
        item.ratingAvg = item.rating.map((item) => item.score).reduce((a, b) => a + b, 0) / item.rating.length;
      } catch (e) {
        item.ratingAvg = 0;
      }
      item.price = parseInt(item.price.toString());
      if (item.price < 1000) {
        item.price = item.price * 1000;
      }
      if (item.sellingPrice < 1000) {
        item.sellingPrice = item.sellingPrice * 1000;
      }
      item.productCount = item.color.map((color) => color.size.map((size) => size.productCount)).map((item) => item.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);

    });
    await this.productRepository.save(products);
  }

  async findAll(queryProductDto: QueryProductDto): Promise<ProductDto[]> {
    let options = {
      where: {
        type: { $regex: queryProductDto.type, $options: "i" },
        productName: { $regex: queryProductDto.productName, $options: "i" },
        status: queryProductDto.status,
        brand: { $regex: queryProductDto.brand, $options: "i" },
        price: {
          $gte: queryProductDto.priceTo,
          $lte: queryProductDto.priceFrom
        },
        //gte là lớn hơn hoặc bằng; lte là nhỏ hơn hoặc bằng
        ratingAvg: { $gte: queryProductDto.rating },
        style: queryProductDto.style,
        catalog: queryProductDto.catalog,
        purpose: queryProductDto.purpose,
        features: queryProductDto.feature
      },
      // skip: queryProductDto.skip,
      // take: queryProductDto.take,
      order: {}
    };
    if (queryProductDto.orderBy) {
      options = Object.assign(options, {
        order: {
          [queryProductDto.orderBy]: queryProductDto.order
        }
      });
    }
    if (!queryProductDto.type) {
      delete options.where.type;
    }
    if (!queryProductDto.productName) {
      delete options.where.productName;
    }
    if (!queryProductDto.status) {
      delete options.where.status;
    }
    if (!queryProductDto.brand) {
      delete options.where.brand;
    }
    if (!queryProductDto.priceFrom) {
      delete options.where.price.$lte;
    }
    if (!queryProductDto.priceTo) {
      delete options.where.price.$gte;
    }
    if (!queryProductDto.priceFrom && !queryProductDto.priceTo) {
      delete options.where.price;
    }
    if (!queryProductDto.rating) {
      delete options.where.ratingAvg;
    }
    if (!queryProductDto.style) {
      delete options.where.style;
    }
    if (!queryProductDto.catalog) {
      delete options.where.catalog;
    }
    if (!queryProductDto.purpose) {
      delete options.where.purpose;
    }
    if (!queryProductDto.feature) {
      delete options.where.features;
    }
    console.log(options);
    // @ts-ignore
    const listProducts = await this.productRepository.find(options);
    return JSON.parse(JSON.stringify(listProducts));
  }

  async findOne(id: string): Promise<ProductDto> {
    // @ts-ignore
    const product = await this.productRepository.findOneBy(id);
    if (!product) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
    }

    const producttest = await this.productRepository.findBy({
      image: "string"
    });
    console.log(producttest);

    return {
      ...product,
      id: product.id.toString()
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDto> {
    // @ts-ignore
    const product = this.productRepository.findOneBy(id);
    console.log(product);
    if (!product) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
    }
    await this.productRepository.update(id, updateProductDto);
    return {
      ...product,
      // @ts-ignore
      id: id
    };
  }

  async remove(id: string) {
    return await this.productRepository.delete(id);
  }

  async createRating(id: string, rating: rating): Promise<ProductDto> {
    const user = AuthService.getAuthUser();
    // @ts-ignore
    let product = await this.productRepository.findOneBy(id);

    if (!product) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
    }
    rating.userId = user.id;
    try {
      // @ts-ignore
      product.rating.push(rating);
    } catch (e) {
      // @ts-ignore
      product.rating = [rating];
    }
    console.log(product.rating.map((item) => item.score).reduce((a, b) => a + b, 0) / product.rating.length);
    product.ratingAvg = product.rating.map((item) => item.score).reduce((a, b) => a + b, 0) / product.rating.length;

    await this.productRepository.save(product);
    // @ts-ignore
    return rating;
  }


}
