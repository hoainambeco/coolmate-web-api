import {HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users/entities/user.entity";
import {MongoRepository, Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "./shared/service/config.service";
import {ProductDto} from "./product/dto/product.dto";
import {Product} from "./product/entities/product.entity";
import {UserDto} from "./users/dto/user.dto";
import {format} from "date-fns";
import {ErrorException} from "./exceptions/error.exception";
import {IFile} from "./product/file.interface";
import {AuthService} from "./auth/auth.service";
import {Oder} from "./oders/entities/oder.entity";
import {OderDto} from "./oders/dto/oder.dto";
import {StatusProductEnum} from "./enum/product";
import {Notification} from "./users/entities/user.entity";
import {getMessaging} from "firebase-admin/messaging";
import mongoose, {Schema} from "mongoose";
import {Voucher} from "./voucher/entities/voucher.entity";
import {VoucherDto} from "./voucher/dto/voucher.dto";
import { ObjectId } from "mongodb";

export const imgBannerSchema = mongoose.model("imgBanners", new mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    delete: {
        type: Boolean,
        default: false
    },
}));

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
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @InjectRepository(Voucher)
        private voucherRepository: Repository<Voucher>,
        private authService: AuthService
    ) {
    }

    getLogin(req, res) {
        if (req.session.user) {
            req.session.destroy();
        }
        return res.render('./login');
    }

    async postLogin(req, res) {
        const user = await this.userRepository.findOneBy({email: req.body.email});
        if (!user) {
            return res.render("./login", {
                msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\"> Không tìm thấy người dùng!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>"
            });
        }
        if (user.role.toString() != "ADMIN") {
            return res.render("./login", {
                msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\"> Người dùng không có quyền truy cập!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>"
            });
        }
        if (user && (await bcrypt.compare(req.body.password, user.password))) {
            const payload = {username: user.email, sub: user.id};
            const access_token = await this.jwtService.signAsync({id: user.id}, {secret: this.configService.get("JWT_SECRET_KEY")});
            req.session.user = {...user, access_token: access_token};
            res.redirect("/product");
            res.writeHead();
        } else {
            return res.render("./login", {
                msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\"> Sai Mật khẩu!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>"
            });
        }
    }

    getHello() {
        return {
            message: "Hello World!"
        };
    }

//product
    async getError(req, res) {
        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        res.render("./error", {msg:"Lỗi", nameNav: nameNav, idUser: idUser, avatar: avatar});

    }
    async getProduct(req, res, query) {
        let option = {
            where: {},
            order: {}
        }
        if (query.status) {
            option = Object.assign(option, {where: {...option.where, status: query.status}})
        }

        switch ( parseInt(query.sort) ) {
            case 0:
                option = Object.assign(option, {order: {createdAt: "ASC"}});
                break;
            case 1:
                option = Object.assign(option, {order: {createdAt: "DESC"}});
                break;
            case 2:
                option = Object.assign(option, {order: {quantitySold: "ASC"}});
                break;
            case 3:
                option = Object.assign(option, {order: {quantitySold: "DESC"}});
                break;
            case 4:
                option = Object.assign(option, {order: {promotionalPrice: "ASC"}});
                break;
            case 5:
                option = Object.assign(option, {order: {promotionalPrice: "DESC"}});
                break;
            case 6:
                option = Object.assign(option, {order: {ratingAvg: "ASC"}});
                break;
            case 7:
                option = Object.assign(option, {order: {ratingAvg: "DESC"}});
                break;
            default:
                break;
        }
        const listProducts = await this.productRepository.find(option);
        listProducts.map(async products => {
            const product = {...products};
            product.productCount = product.color.map((color) => color.size.map((size) => size.productCount)).map((item) => item.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
            product.image = product.color.map((color) => color.image.map((image) => image)).map((item) => item.reduce((a, b) => a.concat(b), [])).reduce((a, b) => a.concat(b), []);
            product.ratingAvg = product.ratingAvg || 0;
            product.status = product.status || StatusProductEnum.CON_HANG;
            await this.productRepository.update(product.id, product);
        });
        let products: ProductDto[] = JSON.parse(JSON.stringify(listProducts));
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        // console.log(query)
        // console.log(option);
        // console.log(products);
        if(products.length <=0){
            res.render("./listBill", {listProduct: products,msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Trống!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>", nameNav: nameNav, idUser: idUser, avatar: avatar});
        }
        res.render("./listProduct", {listProduct: products, nameNav: nameNav, idUser: idUser, avatar: avatar});

    }

    async getAddProduct(req, res) {
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        res.render("./addProduct", {nameNav: nameNav, idUser: idUser, avatar: avatar});

    }

    async postAddProduct(req, res, files: IFile[]) {
        if (!files || !files.length) {
            return res.redirect("/product-add", {
                msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Thêm thất bại do không có file!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>",
            });
        }
        // @ts-ignore
        let listColor: [{ name: string, colorCode: string, image: string[], size: [{ name: string, productCount: number }] }] = [];

        for (let i = 0; i < req.body.stt.length; i++) {
            // @ts-ignore
            let sizeList: [{ name: string, productCount: number }] = [];
            var count = "count_" + req.body.stt[i].toString();
            var size = "size_" + req.body.stt[i].toString();
            for (let j = 0; j < req.body[size].length; j++) {
                if (sizeList.length > 0) {
                    var trung = false;
                    sizeList.forEach((item) => {
                        if (item.name === req.body[size][j]) {
                            item.productCount = Number(parseInt(String(item.productCount)) + parseInt(req.body[count][j]));
                            trung = true;
                        } else if (item.name !== req.body[size][j] && !trung) {
                            trung = false;
                        }
                        return;
                    });
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
            });
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
            ratingAvg: 0
        });
        product.status = StatusProductEnum.CON_HANG;
        product.productCount = product.color.map((color) => color.size.map((size) => size.productCount)).map((item) => item.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
        product.image = product.color.map((color) => color.image.map((image) => image)).map((item) => item.reduce((a, b) => a.concat(b), [])).reduce((a, b) => a.concat(b), []);
        product.quantitySold = 0;
        await this.productRepository.save(product);
        res.redirect("/product");
    }

    async getDetailProduct(req, res, id) {
        const product = await this.productRepository.findOneBy(id);
        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        return res.render("./detailProduct", {product: product, nameNav: nameNav, idUser: idUser, avatar: avatar});
    }

    async postSearchProduct(req, res) {
        if (req.body.SearchValue === "") {
            return res.redirect("/product");
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
        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;

        if (products.length > 0) {
            return res.render("./searchProduct", {
                listProduct: products,
                msg: "<div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Tìm được sản phẩm!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>",
                nameNav: nameNav, idUser: idUser, avatar: avatar
            });
        } else {
            return res.render("./searchProduct", {
                msg: "<div class=\"alert alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Không tìm thấy sản phẩm!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>",
                nameNav: nameNav, idUser: idUser, avatar: avatar
            });
        }
    }

    async getUpdateProduct(req, res, id) {
        const product = await this.productRepository.findOneBy(id);
        // @ts-ignore
        product.id = product.id.toString();
        // @ts-ignore
        product.createdAt = format(new Date(product.createdAt), "dd-MM-yyyy");

        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        return res.render("./updateProduct", {product: product, nameNav: nameNav, idUser: idUser, avatar: avatar});
    }

    async postUpdate(req, res, id, files: IFile[]): Promise<ProductDto> {
        // console.log(req.body);
        // @ts-ignore
        let product = await this.productRepository.findOneBy(id);
        if (!product) {
            throw new ErrorException(HttpStatus.NOT_FOUND, "Product not found");
        }
        var listDataUpdateImage = req.body.dataUpdate.split(",");
        // @ts-ignore
        let listColor: [{ name: string, colorCode: string, image: string[], size: [{ name: string, productCount: number }] }] = [];
        var productCount = 0;
        for (let i = 0; i < req.body.stt.length; i++) {
            // @ts-ignore
            let sizeList: [{ name: string, productCount: number }] = [];
            var count = "count_" + req.body.stt[i].toString();
            var size = "size_" + req.body.stt[i].toString();
            for (let j = 0; j < req.body[size].length; j++) {
                if (sizeList.length > 0) {
                    var trung = false;
                    sizeList.forEach((item) => {
                        if (item.name === req.body[size][j]) {
                            item.productCount = Number(parseInt(String(item.productCount)) + parseInt(req.body[count][j]));
                            productCount += parseInt(req.body[count][j]);
                            trung = true;
                        } else if (item.name !== req.body[size][j] && !trung) {
                            trung = false;
                        }
                        return;
                    });
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
            });
        }

        var tmp = Number(req.body.sellingPriceProduct) - (Number(req.body.rebate) * Number(req.body.sellingPriceProduct)) / 100;
        tmp = Math.round(tmp);

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
        await this.productRepository.update(product.id, productNew);
        return res.redirect("/update-product/" + id);
    }

    async postUpdateStatusProduct(req, res, id): Promise<ProductDto> {
        let product = await this.productRepository.findOneBy(id);
        product.status = req.body.status;

        await this.productRepository.update(product.id, product);

        return res.redirect("/productDetail/" + id);
    }

    //user
    async getProfileAdmin(req, res, id) {
        const user = await this.userRepository.findOneBy(id);

        // @ts-ignore
        user.birthday = format(new Date(user.birthday), "dd-MM-yyyy");
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        return res.render("./adminInfo", {user: user, nameNav: nameNav, idUser: idUser, avatar: avatar});
    }

    async getListCustomer(req, res) {
        const listUser = await this.userRepository.findBy({role: "user"});
        let users: UserDto[];
        // @ts-ignore
        users = listUser.map((user) => {
            return {
                ...user,
                id: user.id.toString(),
                birthday: format(new Date(user.birthday), "dd-MM-yyyy")
            };
        });
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        res.render("./listUser", {listUser: users, nameNav: nameNav, idUser: idUser, avatar: avatar});

    }

    async getDetailUser(req, res, id) {
        const user = await this.userRepository.findOneBy(id);

        // @ts-ignore
        user.birthday = format(new Date(user.birthday), "dd-MM-yyyy");
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        return res.render("./profile", {user: user, nameNav: nameNav, idUser: idUser, avatar: avatar});
    }

    async postUpdateUser(req, res , id): Promise<UserDto> {
        // console.log(req.body)
        // @ts-ignore
        let user = await this.userRepository.findOneBy(req.body.updateUserID);

        if (!user) {
            throw new ErrorException(HttpStatus.NOT_FOUND, "user not found");
        }
        try {
            // @ts-ignore
            user.status = req.body.updateUserStatus;
        } catch (e) {
            console.log(e);
        }
        // console.log(user)
        await this.userRepository.update(user.id,user);
        return res.redirect("/userInfo/"+id)
    }

    async postSearchUser(req, res) {
        if (req.body.SearchValue === "") {
            return res.redirect("/customers");
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
                birthday: format(new Date(user.birthday), "dd-MM-yyyy"),
                address: user.address,
                phone: user.phone,
                avatar: user.avatar,
                isCreate: user.isCreate,
                otp: user.otp
            };
        });
        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        if (users.length > 0) {
            return res.render("./listUser", {
                listUser: users,
                msg: "<div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Tìm được người dùng!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>",
                nameNav: nameNav, idUser: idUser, avatar: avatar
            });
        } else {
            return res.render("./listUser", {
                msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Không tìm thấy người dùng!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>",
                nameNav: nameNav, idUser: idUser, avatar: avatar
            });
        }
    }

    async postChangePass(req, res, id) {
        const user = await this.userRepository.findOneBy(id);
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;

        const isPasswordValid = await bcrypt.compare(req.body.pass, user.password);
        // @ts-ignore
        user.birthday = format(new Date(user.birthday), "dd-MM-yyyy");
        if (!isPasswordValid) {
            return res.render("./adminInfo", {
                user: user,
                nameNav: nameNav,
                idUser: idUser,
                avatar: avatar,
                msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Đổi mật khẩu thất bại! Do mật khẩu cũ không trùng khớp</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>",

            });
        }
        if (req.body.newPass !== req.body.ConfirmPass) {
            return res.render("./adminInfo", {
                user: user,
                nameNav: nameNav,
                idUser: idUser,
                avatar: avatar,
                msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Đổi mật khẩu thất bại! Do mật khẩu mới và nhập lại không trùng khớp</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>",

            });
        }
        user.password = await bcrypt.hashSync(req.body.newPass, 6);
        await this.userRepository.update(user.id, user);
        return res.render("./adminInfo", {
            user: user,
            nameNav: nameNav,
            idUser: idUser,
            avatar: avatar,
            msg: "<div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n" +
                "  <p style=\"margin: 0\">Đổi mật khẩu thành công</p>" +
                "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                "</div>",
        });
    }

    /// bill
    async getListBill(req, res, query) {
        let option = {
            where: {},
            order: {}
        }
        if (query.pay) {
            option = Object.assign(option, {where: {...option.where, status: query.pay}})
        }
        if (query.ship) {
            option = Object.assign(option, {
                where: {
                    ...option.where,
                    shippingStatus: {$elemMatch: {shippingStatus: query.ship}}
                },
                project:{shippingStatus:{$slice: -1}}
            });
        }

        switch (parseInt(query.sort)) {
            case 0:
                option = Object.assign(option, {order: {updatedAt: "DESC"}});
                // console.log(option)
                break;
            case 1:
                option = Object.assign(option, {order: {updatedAt: "ASC"}});
                break;
            case 2:
                option = Object.assign(option, {order: {createdAt: "DESC"}});
                break;
            case 3:
                option = Object.assign(option, {order: {createdAt: "ASC"}});
                break;
            default:
                break;
        }
        // console.log(option);
        const listOders = await this.oderRepository.find(option);
        // console.log(listOders);
        let ListBill: OderDto[];
        ListBill = JSON.parse(JSON.stringify(listOders));
        if(query.ship){
            //@ts-ignore
            ListBill = JSON.parse(JSON.stringify(listOders.map(option => {
                //@ts-ignore
                // console.log(option.shippingStatus[option.shippingStatus.length-1].shippingStatus);
                //@ts-ignore
                if (option.shippingStatus[option.shippingStatus.length-1].shippingStatus == query.ship) {
                return option
            }})));
            // console.log(ListBill);
        }
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;

        if(ListBill.length <=0){
            res.render("./listBill", {listBill: ListBill,msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Trống!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>", nameNav: nameNav, idUser: idUser, avatar: avatar});
        }
        res.render("./listBill", {listBill: ListBill, nameNav: nameNav, idUser: idUser, avatar: avatar});

    }

    async getDetailBill(req, res, id) {
        const bill = await this.oderRepository.findOneBy(id);
        // @ts-ignore
        bill.id = bill.id.toString();
        // @ts-ignore
        bill.createdAt = format(new Date(bill.createdAt), "dd-MM-yyyy");

        //format ngày của trạng thái đơn hàng

        let list = bill.shippingStatus.map((status) => {
            return {
                ...status,
                // @ts-ignore
                shippingStatus: status.shippingStatus,
                // @ts-ignore
                note: status.note,
                // @ts-ignore
                createdAt: format(new Date(status.createdAt), "HH:mm dd-MM-yyyy"),
            };
        });
        let ListProduct = bill.cartProduct.map((item) => {
            return {

            };
        });
        // @ts-ignore
        bill.shippingStatus = list;
        let voucher
        if(bill.voucherId[0]){
            // @ts-ignore
            voucher = await this.voucherRepository.findOneBy(bill.voucherId[0])
        }
        let User = await this.userRepository.findOneBy(bill.userId);



        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        return res.render("./detailBill", {bill: bill,user:User,voucher: voucher, nameNav: nameNav, idUser: idUser, avatar: avatar});
    }

    async postUpdateStatusBill(req, res, id): Promise<OderDto> {
        const bill = await this.oderRepository.findOneBy(id);

        if (!bill) {
            throw new ErrorException(HttpStatus.NOT_FOUND, "bill not found");
        }
        try {
            bill.status = req.body.status;



        } catch (e) {
            console.log(e);
        }
        await this.oderRepository.update(bill.id, bill);
        return res.redirect("/detailBill/" + id);
    }

    async postUpdateStatusShippingBill(req, res, id): Promise<OderDto> {
        const bill = await this.oderRepository.findOneBy(id);

        if (!bill) {
            throw new ErrorException(HttpStatus.NOT_FOUND, "bill not found");
        }
        if (bill.shippingStatus.find((shippingStatus) => shippingStatus == req.body.status)){
            throw new ErrorException(HttpStatus.BAD_REQUEST, "bill not found");
        }
        try {
            bill.shippingStatus.push(
                {
                    shippingStatus: req.body.status,
                    note: "",
                    createdAt: new Date()
                }
            );
            if(req.body.status === "Đang chuẩn bị hàng"){
                bill.cartProduct.map(async (item) => {
                    // @ts-ignore
                    const product = await this.productRepository.findOneBy(item.productId);
                    for (let i = 0; i < product.color.length; i++) {
                        // @ts-ignore
                        if(item.colorName === product.color[i].name){
                            for (let j = 0; j < product.color[i].size.length; j++) {
                                // @ts-ignore
                                if(product.color[i].size[j].name === item.sizeName){
                                    // @ts-ignore
                                    product.color[i].size[j].productCount -= parseInt(item.quantity);
                                    // @ts-ignore
                                    product.quantitySold += item.quantity;
                                    break;
                                }
                            }
                        }
                    }
                    await this.productRepository.update(product.id, product);
                });
            }
        } catch (e) {
            console.log(e);
        }
        await this.oderRepository.update(bill.id, bill);

        const notification = new Notification();
        notification.title = "Cập nhật trạg thái đơn hàng";
        notification.content = "Đơn hàng:" + id+". Của bạn: "+ bill.status+" lúc" + format(new Date(bill.updatedAt), "dd-MM-yyyy");
        notification.userId = null;
        notification.file = 'https://coolmate.pimob.me/image/logo-app.svg';
        notification.createdAt = new Date() || null;
        notification.updatedAt = new Date() || null;
        notification.deletedAt = null;
        notification.status = "ACTIVE" || null;

        const user = await this.userRepository.findOneBy(ObjectId(bill.userId));
        // console.log(user);
        notification.userId = user.id.toString() || null;
        getMessaging().send({
            android: {
                notification: {
                    title: "Cập nhật trạng thái đơn hàng",
                    body: "Đơn hàng có mã:\n" + id+" của bạn\n"+ bill.status+" vào lúc " + format(new Date(bill.updatedAt), "dd-MM-yyyy"),
                    imageUrl:'https://coolmate.pimob.me/image/logo-app.svg'
                }
            },
            token: user.registrationToken
        })
            .then(async (response) => {
                    console.log("Successfully sent message:", response);
                    await this.notificationRepository.save(notification);
                }
            )
            .catch((error) => {
                console.log("Error sending message:", error);
            });
        return res.redirect("/detailBill/" + id);
    }

    async postSearchBill(req, res) {
        if (req.body.SearchValue === "") {
            return res.redirect("/bills");
        }
        let ListBill: OderDto[];
        // @ts-ignore
        ListBill = await this.oderRepository.find({where: {customerName: new RegExp(`${req.body.SearchValue}`)}});

        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        if (ListBill.length > 0) {
            return res.render("./searchBill", {
                listBill: ListBill,
                msg: "<div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Tìm được hóa đơn!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>",
                nameNav: nameNav, idUser: idUser, avatar: avatar
            });
        } else {
            return res.render("./searchBill", {
                msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\">Không tìm thấy hóa đơn!</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>",
                nameNav: nameNav, idUser: idUser, avatar: avatar
            });
        }
    }

    //dashboard
    async getDashboard(req, res) {

        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }
        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        const statistical = await this.authService.statistical();

        res.render("./dashboard", {nameNav: nameNav, idUser: idUser, avatar: avatar, statistical: statistical});
    }

    //noti
    getNoti(req, res) {
        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        return res.render("./noti", {nameNav: nameNav, idUser: idUser, avatar: avatar});
    }

    async postNoti(req, res, file) {
        const notification = new Notification();
        notification.title = req.body.title || null;
        notification.content = req.body.content || null;
        notification.userId = null;
        notification.file = `https://coolmate.pimob.me/${file.path}` || null;
        notification.createdAt = new Date() || null;
        notification.updatedAt = new Date() || null;
        notification.deletedAt = null;
        notification.status = "ACTIVE" || null;

        if (req.body.userId) {
            const user = await this.userRepository.findOneBy(req.body.userId);
            // console.log(user);
            notification.userId = user.id.toString() || null;
            getMessaging().send({
                android: {
                    notification: {
                        title: notification.title,
                        body: notification.content,
                        imageUrl: notification.file.split("\\").join("/")
                    }
                },
                token: user.registrationToken
            })
                .then(async (response) => {
                        console.log("Successfully sent message:", response);
                        await this.notificationRepository.save(notification);
                    }
                )
                .catch((error) => {
                    console.log("Error sending message:", error);
                });
        } else {
            const user = await this.userRepository.find();
            const registrationToken = [...new Set(user.map((item) => {
                if (item.registrationToken) return item.registrationToken;
            }))];
            let message = {
                android: {
                    notification: {
                        title: notification.title,
                        body: notification.content,
                        imageUrl: notification.file.split("\\").join("/")
                    }
                },
                tokens: []
            };
            registrationToken.forEach((item) => {
                if (item) {
                    message.tokens.push(item);
                }
            });
            await getMessaging().sendMulticast(message)
                .then((response) => {
                        console.log("Successfully sent message:", response);
                    }
                )
                .catch((error) => {
                    console.log("Error sending message:", error);
                });
        }
        return res.redirect("/noti");
    }

    async getUserNoti(req, res, email) {
        const user = await this.userRepository.findOneBy({email: email});
        if (!user) {
            throw new ErrorException(HttpStatus.NOT_FOUND, "user not found");
        }
        return res.json(user);
    }

    //masage
    async getMessage(req, res) {
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        res.render("./message", {nameNav: nameNav, idUser: idUser, avatar: avatar});
    }

    //voucher
    async getVoucher(req, res) {
        const listVoucherFind = await this.voucherRepository.find();
        listVoucherFind.map((voucher) => {
            // console.log(voucher);
            return {
                ...voucher,
                id: voucher.id.toString(),
                startDate: format( new Date(voucher.startDate), "HH:mm dd-MM-yyyy"),
                endDate: format( new Date(voucher.endDate), "HH:mm dd-MM-yyyy"),
            };

        });
        // console.log(listVoucherFind)
        var nameList = req.session.user.fullName.split(" ");

        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;
        res.render("./voucher", {listVoucher :listVoucherFind, nameNav: nameNav, idUser: idUser, avatar: avatar});
    }

    async postAddVoucher(req, res) {
        // console.log(req.body);
        // @ts-ignore
        const oldVoucher = await this.voucherRepository.findOneBy( {where: {code: req.body.code}});
        var nameList = req.session.user.fullName.split(" ");
        var nameNav = "";
        if (nameList.length >= 2) {
            nameNav = nameList[0] + " " + nameList[nameList.length - 1];
        } else {
            nameNav = nameList[0];
        }

        var idUser = req.session.user.id;
        var avatar = req.session.user.avatar;

        if(oldVoucher){
            const listVoucher = await this.voucherRepository.find();
            listVoucher.map((voucher) => {
                return {
                    ...voucher,
                    id: voucher.id.toString(),
                    startDate: format(new Date(voucher.startDate), "HH:mm dd-MM-yyyy"),
                    endDate: format(new Date(voucher.endDate), "HH:mm dd-MM-yyyy"),
                };
            });
            res.render("./voucher", {
                listVoucher,
                nameNav: nameNav,
                idUser: idUser,
                avatar: avatar,
                msg: "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
                    "  <p style=\"margin: 0\"> Thêm thất bại! Do mã giảm giá đã tồn tại</p>" +
                    "  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
                    "</div>"

            });
        }
        const user = await this.userRepository.findOneBy({where: {email: req.body.email}});
        const voucher = this.voucherRepository.create({
            code: req.body.code,
            condition: req.body.condition,
            discount: parseInt(req.body.value),
            description: req.body.description,
            value: parseInt(req.body.value),
            status: "Còn mã",
            startDate: new Date(req.body.startDate) ,
            endDate: new Date(req.body.endDate) ,
            type: req.body.type || "",
            isMonopoly: !!req.body.email || !!req.body.userId || false,
            used: 0,
            userId: req.body.userId || null,
        });
        await this.voucherRepository.save(voucher);


        res.redirect("/voucher");
    }

    async postUpdateVoucherStatus(req, res): Promise<VoucherDto> {
        // @ts-ignore
        let voucher = await this.voucherRepository.findOneBy(req.body.id);

        if (!voucher) {
            throw new ErrorException(HttpStatus.NOT_FOUND, "voucher is not found!");
        }
        try {
            // @ts-ignore
            voucher.status = req.body.status;
        } catch (e) {
            console.log(e);
        }
        await this.voucherRepository.update(voucher.id, voucher);
        return res.redirect("/voucher");
    }


///
    async postImgBaner(file) {

        const img = await imgBannerSchema.find({delete: false});
        // console.log(img);
        if (img.length > 0) {
            img.map(async (item) => {
                await imgBannerSchema.findByIdAndUpdate(item._id, {
                    delete: true
                });
            })
        }
        await imgBannerSchema.insertMany(file);
        // mongoose.connection.close().then(() => {
        //   console.log("close");
        // });
        return true;
    }

    async getImgBanner() {
        return imgBannerSchema.find({delete: false});
    }
    async getNotiByUser (user: UserDto) {
        const noti = await this.notificationRepository.find({where: {userId: user.id}});
        return JSON.parse(JSON.stringify(noti));
    }
}
