import {Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users/entities/user.entity";
import {MongoRepository, Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "./shared/service/config.service";
import {ProductDto} from "./product/dto/product.dto";
import {Product} from "./product/entities/product.entity";
import {UserDto} from "./users/dto/user.dto";
import {compareAsc, format} from 'date-fns'
import {resolve} from "path";
import fs from "fs";

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {
    }

    getLogin(req, res) {
        return {
            message: 'Hello World!',
        };
    }

    async postLogin(req, res) {
        const user = await this.userRepository.findOneBy({email: req.body.email});
        if (!user) {
            return res.render('./login', {
                msg: '<div class="alert alert-danger" role="alert">\n' +
                    'Không tìm thấy user' +
                    '</div>',
            });
        }
        if (user && (await bcrypt.compare(req.body.password, user.password))) {
            const payload = {username: user.email, sub: user.id};
            const access_token = await this.jwtService.signAsync({id: user.id}, {secret: this.configService.get('JWT_SECRET_KEY')})
            req.session.user = {...user, access_token: access_token}
            res.redirect('/product');
            res.writeHead()
        } else {
            return res.render('./login', {
                msg: '<div class="alert alert-danger" role="alert">\n' +
                    'Sai mat khau' +
                    '</div>',
            });
        }
    }

    getHello() {
        return {
            message: 'Hello World!',
        };
    }

//product
    async getProduct(req, res) {
        const listProducts = await this.productRepository.find({
            order: {updatedAt: 'ASC'},
            skip: 0,
            take: 10,
        });
        let products: ProductDto[];
        products = listProducts.map((product) => {
            return {
                id: product.id.toString(),
                modelID: product.modelID,
                cmtCount: product.cmtCount,
                rebate: product.rebate,
                specialSale: product.specialSale,
                likeCount: product.likeCount,
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
                promotionalPrice: product.promotionalPrice,
                color: product.color,
                rating: product.rating,
            };
        });
        res.render('./listProduct', {listProduct: products});

    }

    async postAddProduct(req, res) {
        console.log(req.body);

        // @ts-ignore
        let listColor: [{ name: string, image: string[], size: [{ name: string, productCount: number }] }]=[];

        for (let i = 0; i < req.body.stt.length; i++) {
            // @ts-ignore
            let sizeList: [{ name: string, productCount: number }] = [];
            var count = 'count_' + req.body.stt[i].toString()
            var size = 'size_' + req.body.stt[i].toString()
            for (let j = 0; j < req.body[size].length; j++) {
                sizeList.push({name: req.body[size][j], productCount: req.body[count][j]})
            }
            listColor.push({
                name: req.body.nameColor[i],
                image: req.body.colorImage[i],
                size: sizeList
            })
        }
        const product = this.productRepository.create({
            modelID: req.body.idProduct,
            productName: req.body.productName,
            price: req.body.priceProduct,
            description: req.body.Description,
            createdAt: new Date(),
            color: listColor
        });
        console.log(product);
        await this.productRepository.save(product);

    }

    async getProductDetail(req, res) {

    }

    async getDeleteProduct(req, res) {

    }

    async getDetailProduct(req, res, id) {
        console.log(id);
        const product = await this.productRepository.findOneBy(id);
        console.log(product.createdAt);
        return res.render('./detailProduct', {product: product})
    }

//user
    async getListCustomer(req, res) {
        const listUser = await this.userRepository.find({});
        let users: UserDto[];
        // @ts-ignore
        users = listUser.map((user) => {
            return {
                ...user,
                id: user.id.toString(),
                birthday: format(new Date(user.birthday), 'dd-MM-yyyy')
            };
        });
        console.log(users);
        res.render('./listUser', {listUser: users});

    }

}
