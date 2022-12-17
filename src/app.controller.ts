import {
    Controller,
    Get, HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post, Query, Render,
    Req,
    Res, UploadedFile,
    UploadedFiles, UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AppService} from "./app.service";
import {ApiBearerAuth, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import * as multer from "multer";
import {diskStorage} from "multer";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {extname} from "path";
import {MongoClient} from "mongodb";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {AuthUserInterceptor} from "./interceptors/auth-user.interceptor";
import {UserDto} from "./users/dto/user.dto";
import fetch from "node-fetch";

export const imageFileFilter = (req, file, callback) => {
    console.log(file);
    let permittedFileTypes = [
        // images
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".ico"
    ];
    if (!permittedFileTypes.includes(extname(file.originalname.toLowerCase()))) {
        return callback(
            new HttpException(
                "The file type are not allowed!",
                HttpStatus.BAD_REQUEST
            ),
            false
        );
    }

    callback(null, true);
};
export const editFileName = (req, file, callback) => {
    const name = file.originalname.split(".")[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 10).toString(10))
        .join("");
    callback(null, `${name}-${randomName}${fileExtName}`);
};

@ApiTags("web")
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    @Render("listProduct")
    root(@Req() req, @Res() res,@Query() query) {
        if (!req.session.user) {
            res.redirect("/login");
        }
        return this.appService.getProduct(req, res,query);
    }

    @Get("product")
    getListProduct(@Req() req, @Res() res,@Query() query) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getProduct(req, res,query);
    }

    @Get("product-add")
    addProduct(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getAddProduct(req, res);
    }

    @Post("product-add")
    @Render("addProduct")
    @UseInterceptors(
        FilesInterceptor("colorImage", 100, {
            storage: diskStorage({
                destination: "./uploads/imageProduct",
                filename: editFileName,
            }),
            fileFilter: imageFileFilter
        })
    )
    postAddProduct(@Req() req, @Res() res, @UploadedFiles() files
    ) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postAddProduct(req, res, files);
    }

    @Get("productDetail/:id")
    getDetailProduct(@Req() req, @Res() res, @Param("id") param) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getDetailProduct(req, res, param);
    }

    @Post("/searchProduct")
    postSearchProduct(@Req() req, @Res() res
    ) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postSearchProduct(req, res);
    }

    @Post("/update/product/status/:id")
    postUpdateProductStatus(@Req() req, @Res() res, @Param("id") param
    ) {
        return this.appService.postUpdateStatusProduct(req, res, param);
    }

    @Get("/update-product/:id")
    getUpdateStatusBill(@Req() req, @Res() res, @Param("id") param
    ) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getUpdateProduct(req, res, param);
    }


    @Post("/update-product/:id")
    @UseInterceptors(
        FilesInterceptor("colorImage", 100, {
            storage: diskStorage({
                destination: "./uploads/imageProduct",
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    postUpdateProduct(@Req() req, @Res() res, @Param("id") param, @UploadedFiles() files
    ) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postUpdate(req, res, param, files);
    }

// admin
    @Get("adminInfo/:id")
    getProfile(@Req() req, @Res() res, @Param("id") param) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getProfileAdmin(req, res, param);
    }

    //user
    @Get("customers")
    @Render("listUser")
    getListUser(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getListCustomer(req, res);
    }

    @Get("userInfo/:id")
    showUserInfo(@Req() req, @Res() res, @Param("id") param) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getDetailUser(req, res, param);
    }

    @Post("userInfo/:id")
    postUpdateUser(@Req() req, @Res() res
    ) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postUpdateUser(req, res);
    }

    @Post("/searchUser")
    postSearch(@Req() req, @Res() res
    ) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postSearchUser(req, res);
    }

    @Post("adminInfo/:id")
    postChangePass(@Req() req, @Res() res, @Param("id") param
    ) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postChangePass(req, res,param);
    }

    //login
    @Get("login")
    getlogin(@Req() req, @Res() res
    ) {
        return this.appService.getLogin(req, res);
    }

    @Post("login")
    @Render("login")
    postlogin(@Req() req, @Res() res
    ) {
        return this.appService.postLogin(req, res);
    }

    //dashboard
    @Get("dashboard")
    getDashboard(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getDashboard(req, res);
    }

    //bill
    @Get("bills")
    getListBill(@Req() req, @Res() res, @Query() query) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getListBill(req, res, query);
    }

    @Get("detailBill/:id")
    getDetailBill(@Req() req, @Res() res, @Param("id") param) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getDetailBill(req, res, param);
    }

    @Post("updateStatus/payment/:id")
    postUpdateStatusBill(@Req() req, @Res() res, @Param("id") param
    ) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postUpdateStatusBill(req, res, param);
    }

    @Post("updateStatus/shipping/:id")
    postUpdateStatusShippingBill(@Req() req, @Res() res, @Param("id") param
    ) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postUpdateStatusShippingBill(req, res, param);
    }

    @Post("searchBill")
    postSearchBill(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postSearchBill(req, res);
    }

//noti
    @Get("noti")
    getNoti(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getNoti(req, res);
    }

    @Get('getUser/:email')
    getUser(@Req() req, @Res() res, @Param("email") email) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getUserNoti(req, res, email);
    }

    @Post("noti")
    @UseInterceptors(
        FileInterceptor('imgNoti', {
            storage: diskStorage({
                destination: './uploads/noti',
                filename: (req, file, callback) => {
                    const name = file.originalname.split('.')[0];
                    const fileExtName = extname(file.originalname);
                    const randomName = Math.round(Date.now() / 1000);
                    callback(null, `${name}-${randomName}${fileExtName}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                const imageMimeType = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'image/*',
                ];
                if (!imageMimeType.includes(file.mimetype)) {
                    return callback(
                        new HttpException(
                            'Only image files are allowed!',
                            HttpStatus.BAD_REQUEST,
                        ),
                        false,
                    );
                }
                callback(null, true);
            },
        }),
    )
    postNoti(@Req() req, @Res() res, @UploadedFile() file) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postNoti(req, res, file);
    }

    //message
    @Get("message")
    getMessage(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getMessage(req, res);
    }

    //voucher
    @Get("voucher")
    getVoucher(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getVoucher(req, res);
    }

    @Post("voucher")
    postVoucher(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postAddVoucher(req, res);
    }

    @Post("updateVoucher")
    postUpdateVoucher(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.postUpdateVoucherStatus(req, res);
    }
}

@ApiTags("service")
@Controller("rss")
export class rss {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    async getRss() {
        return fetch("https://www.toptal.com/developers/feed2json/convert?url=https%3A%2F%2Fmenback.com%2Fchu-de%2Fphong-cach%2Ffeed&minify=on").then((response) => response.json())
            .then(data => {
                data.items.map((value) => delete value.content_html);
                return data
            });
    }

    @Post("postImgBanner")
    @UseInterceptors(
        FilesInterceptor("file", 100, {
            storage: diskStorage({
                destination: "./uploads/imageBanner",
                filename: editFileName,
            }),
            fileFilter: imageFileFilter
        })
    )
    async postImg(@UploadedFiles() file) {
        return await this.appService.postImgBaner(file);
    }

    @Get('ImgBanner')
    async getImgBanner() {
        return JSON.parse(JSON.stringify(await this.appService.getImgBanner()));
    }
}
