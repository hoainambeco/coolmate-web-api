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
import * as Process from "process";
import {StatusProductEnum} from "./enum/product";
import { getMessaging } from "firebase-admin/messaging";

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
                msg: '<div class="alert alert-danger alert-dismissible fade show" role="alert">\n' +
                    '  <p style="margin: 0"> Không tìm thấy người dùng!</p>' +
                    '  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\n' +
                    '</div>',
            });
        }
        if (user.role.toString() != "ADMIN") {
            return res.render('./login', {
                msg: '<div class="alert alert-danger alert-dismissible fade show" role="alert">\n' +
                    '  <p style="margin: 0"> Người dùng không có quyền truy cập!</p>' +
                    '  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\n' +
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
        listProducts.map(async products => {
            const product = {...products}
            product.productCount = product.color.map((color) => color.size.map((size) => size.productCount)).map((item) => item.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
            product.image = product.color.map((color) => color.image.map((image) => image)).map((item) => item.reduce((a, b) => a.concat(b), [])).reduce((a, b) => a.concat(b), []);
            product.ratingAvg = product.ratingAvg || 0;
            product.status = product.status || StatusProductEnum.CON_HANG;
            await this.productRepository.update(product.id, product);
        })
        let products: ProductDto[] = JSON.parse(JSON.stringify(listProducts));
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1]
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        res.render('./listProduct', {listProduct: products, nameNav: nameNav, idUser: idUser});

    }

    async getAddProduct(req, res) {
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1]
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        res.render('./addProduct', {nameNav: nameNav, idUser: idUser});

    }

    async postAddProduct(req, res, files: IFile[]) {
        if (!files || !files.length) {
            return res.redirect('/product-add', {msgFile: `<h6 class="alert alert-danger">Add failed due to no files!</h6>`});
        }
        // @ts-ignore
        let listColor: [{ name: string, colorCode: string, image: string[], size: [{ name: string, productCount: number }] }] = [];

        for (let i = 0; i < req.body.stt.length; i++) {
            // @ts-ignore
            let sizeList: [{ name: string, productCount: number }] = [];
            var count = 'count_' + req.body.stt[i].toString()
            var size = 'size_' + req.body.stt[i].toString()
            for (let j = 0; j < req.body[size].length; j++) {
                if (sizeList.length > 0) {
                    var trung = false;
                    sizeList.forEach((item) => {
                        if (item.name === req.body[size][j]) {
                            item.productCount = Number(parseInt(String(item.productCount)) + parseInt(req.body[count][j]));
                            trung = true;
                        } else if (item.name !== req.body[size][j] && !trung) {
                            trung = false
                        }
                        return;
                    })
                    if (!trung) {
                        sizeList.push({name: req.body[size][j], productCount: parseInt(req.body[count][j])});
                    }
                } else {
                    sizeList.push({name: req.body[size][j], productCount: parseInt(req.body[count][j])});
                }
            }

            listColor.push({
                name: req.body.nameColor[i],
                colorCode: req.body.colorCode[i],
                image: [files[i].path],
                size: sizeList
            })
        }

        var tmp = Number(req.body.sellingPriceProduct) - (Number(req.body.rebate) * Number(req.body.sellingPriceProduct)) / 100;
        tmp = Math.round(tmp);
        let listPurpose = [];
        listPurpose.push(req.body.purpose);
        let listFe = [];
        listFe.push(req.body.feature);
        const product = this.productRepository.create({
            modelID: req.body.idProduct,
            productName: req.body.nameProduct,
            price: Number(req.body.priceProduct),
            description: req.body.Description,
            style: req.body.style,
            catalog: req.body.Catalog,
            material: req.body.material,
            purpose: listPurpose,
            feature: listFe,
            createdAt: new Date(),
            color: listColor,
            rebate: Number(req.body.rebate),
            sellingPrice: Number(req.body.sellingPriceProduct),
            promotionalPrice: Number(tmp),
            ratingAvg: 0,
        });
        product.status = StatusProductEnum.CON_HANG;
        product.productCount = product.color.map((color) => color.size.map((size) => size.productCount)).map((item) => item.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
        product.image = product.color.map((color) => color.image.map((image) => image)).map((item) => item.reduce((a, b) => a.concat(b), [])).reduce((a, b) => a.concat(b), []);
        await this.productRepository.save(product);
        res.redirect('/product');
    }

    async getDetailProduct(req, res, id) {
        const product = await this.productRepository.findOneBy(id);
        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1]
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;

        return res.render('./detailProduct', {product: product, nameNav: nameNav, idUser: idUser})
    }

    async postSearchProduct(req, res) {
        if (req.body.SearchValue === '') {
            return res.redirect('/product');
        }
        let listProducts = [];
        if (req.body.SearchBy == 1) {
            // @ts-ignore
            listProducts = await this.productRepository.find({where: {productName: new RegExp(`${req.body.SearchValue}`)}});
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

    async getUpdateProduct(req, res, id) {
        const product = await this.productRepository.findOneBy(id);
        // @ts-ignore
        product.id = product.id.toString();
        // @ts-ignore
        product.createdAt = format(new Date(product.createdAt), 'dd-MM-yyyy');

        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1]
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        return res.render('./updateProduct', {product: product, nameNav: nameNav, idUser: idUser})
    }

    async postUpdate(req, res, id, files: IFile[]): Promise<ProductDto> {
        console.log(req.body);
        // @ts-ignore
        let product = await this.productRepository.findOneBy(id);
        if (!product) {
            throw new ErrorException(HttpStatus.NOT_FOUND, 'Product not found');
        }
        var listDataUpdateImage = req.body.dataUpdate.split(",");
        // @ts-ignore
        let listColor: [{ name: string, colorCode: string, image: string[], size: [{ name: string, productCount: number }] }] = [];
        var productCount = 0;
        for (let i = 0; i < req.body.stt.length; i++) {
            // @ts-ignore
            let sizeList: [{ name: string, productCount: number }] = [];
            var count = 'count_' + req.body.stt[i].toString()
            var size = 'size_' + req.body.stt[i].toString()
            for (let j = 0; j < req.body[size].length; j++) {
                if (sizeList.length > 0) {
                    var trung = false;
                    sizeList.forEach((item) => {
                        if (item.name === req.body[size][j]) {
                            item.productCount = Number(parseInt(String(item.productCount)) + parseInt(req.body[count][j]));
                            productCount += parseInt(req.body[count][j]);
                            trung = true;
                        } else if (item.name !== req.body[size][j] && !trung) {
                            trung = false
                        }
                        return;
                    })
                    if (!trung) {
                        sizeList.push({name: req.body[size][j], productCount: parseInt(req.body[count][j])});
                        productCount += parseInt(req.body[count][j]);
                    }
                } else {
                    sizeList.push({name: req.body[size][j], productCount: parseInt(req.body[count][j])});
                    productCount += parseInt(req.body[count][j]);
                }

            }
            var path = "";
            if (files.length < 1) {
                path = product.color[req.body.stt.length - i - 1].image[0];
            } else {
                var trueImg = false;
                for (let j = 0; j < files.length; j++) {
                    if (listDataUpdateImage[j] === req.body.stt[i].toString()) {
                        trueImg = true;
                        path = files[j].path;
                        console.log(product.color[i].name + "-thay anh stt" + listDataUpdateImage[j]);
                        break;
                    }
                }
                if (!trueImg) {
                    path = product.color[req.body.stt.length - i - 1].image[0];
                }

            }
            listColor.push({
                name: req.body.nameColor[i],
                colorCode: req.body.colorCode[i],
                image: [path],
                size: sizeList
            })
        }

        var tmp = Number(req.body.sellingPriceProduct) - (Number(req.body.rebate) * Number(req.body.sellingPriceProduct)) / 100;
        tmp = Math.round(tmp)

        let listPurpose = [];
        listPurpose.push(req.body.purpose);
        let listFe = [];
        listFe.push(req.body.feature);
        const productNew = this.productRepository.create({
            modelID: req.body.idProduct,
            productName: req.body.nameProduct,
            price: Number(req.body.priceProduct),
            description: req.body.Description,
            style: req.body.style,
            catalog: req.body.Catalog,
            material: req.body.material,
            purpose: listPurpose,
            feature: listFe,
            createdAt: new Date(),
            color: listColor,
            productCount: productCount,
            rebate: Number(req.body.rebate),
            sellingPrice: Number(req.body.sellingPriceProduct),
            promotionalPrice: Number(tmp),
            ratingAvg: product.ratingAvg,
            status: req.body.status
        });
        console.table(productNew.color);
        await this.productRepository.update(product.id, productNew);
        return res.redirect('/update-product/' + id);
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
            console.log(e);
        }
        await this.userRepository.save(user)
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
        if (!user) {
            throw new ErrorException(HttpStatus.NOT_FOUND, 'user not found');
        }
        user.map(async (user) => {
            await this.userRepository.delete(user.id);
        })
        return true
    }

    /// bill
    async getListBill(req, res) {
        const listOders = await this.oderRepository.find({});
        let ListBill: OderDto[];
        // @ts-ignore
        ListBill = listOders.map((oder) => {
            return {
                ...oder,
                id: oder.id.toString(),
                createdAt: format(new Date(oder.createdAt), 'dd-MM-yyyy')
            };
        });
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1]
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        res.render('./listBill', {listBill: ListBill, nameNav: nameNav, idUser: idUser});
    }

    async getDetailBill(req, res, id) {
        const bill = await this.oderRepository.findOneBy(id);
        // @ts-ignore
        bill.id = bill.id.toString();
        // @ts-ignore
        bill.createdAt = format(new Date(bill.createdAt), 'dd-MM-yyyy');

        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1]
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        return res.render('./detailBill', {bill: bill, nameNav: nameNav, idUser: idUser})
    }

    async postUpdateStatusBill(req, res, id): Promise<OderDto> {
        const bill = await this.oderRepository.findOneBy(id);

        if (!bill) {
            throw new ErrorException(HttpStatus.NOT_FOUND, 'bill not found');
        }
        try {
            bill.status = req.body.status;
        } catch (e) {
            console.log(e);
        }
        await this.oderRepository.save(bill)

        return res.redirect('/detailBill/' + id);
    }

    //noti
    getNoti(req, res) {
        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1]
        } else {
            nameNav = nameList[0];
        }
        var idUser
        return res.render('./noti', {nameNav: nameNav, idUser: idUser})
    }
    //masage
    async getMessage(req, res) {
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1]
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        res.render('./message', { nameNav: nameNav, idUser: idUser});
    }
    async postNoti(req, res,file) {
        const notification = {title: '',file:'', content: '', name: '', createdAt: new Date(), updatedAt: new Date};
        notification.title = req.body.title;
        notification.content = req.body.content;
        notification.name = req.body.name;
        notification.file = `http://coolmate.pimob.me/${file.path}`;
        notification.createdAt = new Date();
        notification.updatedAt = new Date();
        const user = await this.userRepository.find();
        // for (const item of user) {
        //   if (!item.registrationToken) {
        //     item.registrationToken = "fmVvbYa5TLeE_cAwprIbFA:APA91bH-7t8CJRr-b1PRAHh_i1nmg4Xd76RLCvi0_NyWhOiX_cMGtm0HBOe6jC4B1Ieb1VnqSjWupSNx4Z3yiRg4IxvhLxwdVEPN5KHb0QKQLuhZ_TwozsDqvjnxehc-M3h30asWeX5m";
        //     await this.userRepository.save(item);
        //   }
        // }
        const registrationToken = [...new Set(user.map((item) => {if (item.registrationToken) return item.registrationToken}))];
        console.log(registrationToken);
        console.log(notification);
        registrationToken.forEach((item) => {
            if(item){

                const message = {
                    android: {
                        notification: {
                            title: notification.title,
                            body: notification.content,
                            imageUrl: notification.file,
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
            }
        });

        return res.redirect('/noti');
    }
}
