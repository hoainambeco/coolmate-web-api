import {HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
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
import {extname, resolve} from "path";
import fs from "fs";
import {ErrorException} from "./exceptions/error.exception";
import {inspect} from "util";
import * as multer from 'multer';
import {IFile} from "./product/file.interface";
import {AuthService} from "./auth/auth.service";
import {Oder} from "./oders/entities/oder.entity";
import {OderDto} from "./oders/dto/oder.dto";

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Oder)
        private oderRepository: Repository<Oder>,
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
        const listProducts = await this.productRepository.find();
        let products: ProductDto[]= JSON.parse(JSON.stringify(listProducts));
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if(nameList.length >=2){
          nameNav=  nameList[0]+" "+nameList[nameList.length -1]
        }else {
          nameNav=  nameList[0];
        }
        console.log(products[0]);
        console.log(products[0].productCount);
        var idUser = req.session.user.id;
        res.render('./listProduct', {listProduct: products,nameNav:nameNav,idUser:idUser});

    }

    async postAddProduct(req, res, files: IFile[]) {
        console.log(files)
        if (!files || !files.length) {
            return res.redirect('/product-add', {msgFile: `<h6 class="alert alert-danger">Add failed due to no files!</h6>`});
        }
        // @ts-ignore
        let listColor: [{ name: string,colorCode: string, image: string[], size: [{ name: string, productCount: number }] }] = [];

        for (let i = 0; i < req.body.stt.length; i++) {
            // @ts-ignore
            let sizeList: [{ name: string, productCount: number }] = [];
            var count = 'count_' + req.body.stt[i].toString()
            var size = 'size_' + req.body.stt[i].toString()
            console.log(size);
            for (let j = 0; j < req.body[size].length; j++) {
                if (sizeList.length > 0) {

                    sizeList.forEach((item) => {
                        if (item.name === req.body[size][j]) {
                            item.productCount =Number( parseInt(String(item.productCount)) + parseInt(req.body[count][j]));
                        } else {
                            sizeList.push({name: req.body[size][j], productCount: req.body[count][j]})
                        }
                    })
                } else {
                    sizeList.push({name: req.body[size][j], productCount: req.body[count][j]})
                }

            }
            listColor.push({
                name: req.body.nameColor[i],
                colorCode: req.body.colorCode[i],
                image: [files[i].path],
                size: sizeList
            })
        }
        let listPurpose = [];
        listPurpose.push(req.body.purpose);
        let listFe= [];
        listFe.push(req.body.feature);
        const product = this.productRepository.create({
            modelID: req.body.idProduct,
            productName: req.body.productName,
            price: Number(req.body.priceProduct) ,
            description: req.body.Description,
            style: req.body.style,
            catalog: req.body.Catalog,
            material: req.body.material,
            purpose: listPurpose,
            feature: listFe,
            createdAt: new Date(),
            color: listColor,
            rebate:Number(req.body.rebate),
            sellingPrice: Number(req.body.sellingPriceProduct)

        });
        console.log(product);

        await this.productRepository.save(product);
        res.redirect('/product');
        res.writeHead()
    }

    async getDetailProduct(req, res, id) {
        console.log(id);
        const product = await this.productRepository.findOneBy(id);
        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if(nameList.length >=2){
            nameNav=  nameList[0]+" "+nameList[nameList.length -1]
        }else {
            nameNav=  nameList[0];
        }

        var idUser = req.session.user.id;
        return res.render('./detailProduct', {product: product,nameNav:nameNav,idUser:idUser})
    }

    async postSearchProduct(req, res) {
        if (req.body.SearchValue === '') {
            return res.redirect('/product');
        }
        let listProducts = [];
        if (req.body.SearchBy == 1) {
            // @ts-ignore
            listProducts = await this.productRepository.find({where: {productName: new RegExp(`${req.body.SearchValue}`)}});
            console.log(new RegExp(`${req.body.SearchValue}`))
            console.log(listProducts)
        } else if (req.body.SearchBy == 2) {
            listProducts = await this.productRepository.findBy({modelID: req.body.SearchValue});
        }
        let products: ProductDto[];
        products = JSON.parse(JSON.stringify(listProducts));


        if (products.length > 0) {
            return res.render('./listProduct', {
                listProduct: products,
                msg: `<h6 class="alert alert-success">Tìm được sản phẩm</h6>`
            });
        } else {
            return res.render('./listProduct', {
                msg: `<h6 class="alert alert-danger">Không tìm thấy</h6>`
            });
        }
    }

    async postUpdate(req, res): Promise<ProductDto> {
        // @ts-ignore
        let product = await this.productRepository.findOneBy(req.body.updateProductID)

        if (!product) {
            throw new ErrorException(HttpStatus.NOT_FOUND, 'Product not found');
        }
        try {
            // @ts-ignore
            product.modelID = req.body.updateProductIDModel;
            product.productName = req.body.updateProductName;
            product.type = req.body.updateProductType;
            product.price = req.body.updateProductPrice;
            product.status = req.body.updateProductStatus;
            product.description = req.body.updateProductDescription;
        } catch (e) {
            // @ts-ignore
            console.log(e);
        }
        await this.productRepository.save(product)
        // @ts-ignore
        return res.render('./detailProduct', {product: product});
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

    async getDetailUser(req, res, id) {
        const user = await this.userRepository.findOneBy(id);
        return res.render('./profile', {user: user})
    }

    async postUpdateUser(req, res): Promise<UserDto> {
        // @ts-ignore
        let user = await this.userRepository.findOneBy(req.body.id)

        if (!user) {
            throw new ErrorException(HttpStatus.NOT_FOUND, 'user not found');
        }
        try {
            // @ts-ignore
            user.fullName = req.body.updateUserName;
            user.email = req.body.updateUserEmail;
            user.gender = req.body.updateUserGender;
            user.birthday = req.body.updateUserBirthday;
            user.status = req.body.updateUserStatus;
            user.address = req.body.updateUserAddress;
            user.phone = req.body.updateUserPhone;
        } catch (e) {
            // @ts-ignore
            console.log(e);
        }
        await this.userRepository.save(user)
        // @ts-ignore
        return res.render('./profile', {user: user});
    }

    async postSearchUser(req, res) {
        if (req.body.SearchValue === '') {
            return res.redirect('/customers');
        }
        let listUser = [];
        if (req.body.SearchBy == 1) {
            // @ts-ignore
            listUser = await this.userRepository.find({where: {fullName: new RegExp(`${req.body.SearchValue}`)}});
        } else if (req.body.SearchBy == 2) {
            listUser = await this.userRepository.findBy({id: req.body.SearchValue});
        } else {
            listUser = await this.userRepository.findBy({email: req.body.SearchValue});
        }

        let users: UserDto[];
        // @ts-ignore
        users = listUser.map((user) => {
            return {
                id: user.id.toString(),
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
                status: user.status,
                gender: user.gender,
                birthday: user.birthday,
                address: user.address,
                phone: user.phone,
                avatar: user.avatar,
                isCreate: user.isCreate,
                otp: user.otp,
            };
        });

        if (users.length > 0) {
            return res.render('./listUser', {
                listUser: users,
                msg: `<h6 class="alert alert-success">Tìm được sản phẩm</h6>`
            });
        } else {
            return res.render('./listUser', {
                msg: `<h6 class="alert alert-danger">Không tìm thấy</h6>`
            });
        }
    }

    async DeleteUserInActive() {
        const authUser = AuthService.getAuthUser();
        if (authUser.role !== 'ADMIN') {
            throw new ErrorException(HttpStatus.FORBIDDEN, 'Permission denied');
        }
        let user = await this.userRepository.findBy({status: 'INACTIVE'});
        console.log(user);
        if (!user) {
            throw new ErrorException(HttpStatus.NOT_FOUND, 'user not found');
        }
        user.map(async (user) => {
            await this.userRepository.delete(user.id);
            console.log(user.id);
        })
        return true
    }

    /// bill
    async getListBill(req, res) {
        const listOders = await this.oderRepository.find({
            order: {updatedAt: 'ASC'},
            skip: 0,
            take: 10,
        });
        let ListBill: OderDto[];
        ListBill = listOders.map((oder) => {
            return {
                ...oder,
                id: oder.id.toString(),
            };
        });
        console.log(ListBill);
        res.render('./listBill', {listBill: ListBill});
    }
}
