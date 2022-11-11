import {
    Controller,
    Get, HttpException, HttpStatus,
    Param,
    Post,
    Render,
    Req,
    Res,
    Session,
    UploadedFile,
    UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import {AppService} from './app.service';
import {ApiTags} from "@nestjs/swagger";
import * as multer from 'multer';
import {
    AnyFilesInterceptor,
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
    MulterModule
} from "@nestjs/platform-express";
import {extname} from "path";
import {diskStorage} from "multer";
export const imageFileFilter = (req, file, callback) => {
    console.log(file);
    let permittedFileTypes = [
        // images
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.ico',
    ];
    if (!permittedFileTypes.includes(extname(file.originalname.toLowerCase()))) {
        return callback(
            new HttpException(
                'The file type are not allowed!',
                HttpStatus.BAD_REQUEST,
            ),
            false,
        );
    }

    callback(null, true);
};
export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 10).toString(10))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

@ApiTags('web')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {

        var uploader = multer( { dest: './tmp/'});
    }

    @Get()
    @Render('listProduct')
    root(@Req() req, @Res() res) {
        if (!req.session.user) {
            res.redirect('/login')
        }
        return this.appService.getProduct(req, res);
    }

    @Get('product')
    getListProduct(@Req() req, @Res() res) {
        /*if (!req.session.user) {
            res.redirect('login')
        }*/
        return this.appService.getProduct(req, res);
    }

    @Get('product-add')
    @Render('addProduct')
    addProduct() {

        return this.appService.getHello();
    }

    @Post('product-add')
    @Render('addProduct')
    @UseInterceptors(
        FilesInterceptor('colorImage', 100, {
            storage: diskStorage({
                destination: './uploads/imageProduct',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    /*@UseInterceptors(
        FileFieldsInterceptor('colorImage', {
            storage: diskStorage({
                destination: './uploads/imageProduct',
                filename: (req, file, callback) => {
                    const name = file.originalname.split('.')[0];
                    console.log(file);
                    const fileExtName = extname(file.originalname);
                    const randomName = Math.round(Date.now() / 1000);
                    callback(null, `${req.body.idProduct}-${name}-${randomName}${fileExtName}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                const imageMimeType = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
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
    )*/
    postAddProduct(@Req() req, @Res() res,@UploadedFiles() files
    ) {
        return this.appService.postAddProduct(req, res,files);
    }

    @Get('productDetail/:id')
    getDetailProduct(@Req() req, @Res() res, @Param('id') param) {
        return this.appService.getDetailProduct(req, res, param);
    }

    @Post('/searchProduct')
    postSearchProduct(@Req() req, @Res() res
    ) {
        return this.appService.postSearchProduct(req, res);
    }

    @Post('/productDetail/:id')
    postUpdateProduct(@Req() req, @Res() res
    ) {
        return this.appService.postUpdate(req, res);
    }

//
    @Get('profile')
    @Render('profile')
    getProfile() {
        return this.appService.getHello();
    }

    //user
    @Get('customers')
    @Render('listUser')
    getListUser(@Req() req, @Res() res) {
        /*if (!req.session.user) {
            res.redirect('/login')
        }*/
        return this.appService.getListCustomer(req, res);
    }

    @Get('userInfo/:id')
    showUserInfo(@Req() req, @Res() res, @Param('id') param) {
        return this.appService.getDetailUser(req, res, param);
    }
    @Post('userInfo/:id')
    postUpdateUser(@Req() req, @Res() res
    ) {
        return this.appService.postUpdateUser(req, res);
    }
    @Post('/searchUser')
    postSearch(@Req() req, @Res() res
    ) {
        return this.appService.postSearchUser(req, res);
    }
    //login
    @Get('login')
    @Render('login')
    getlogin(@Req() req, @Res() res
    ) {
        return this.appService.getLogin(req, res);
    }

    @Post('login')
    @Render('login')
    postlogin(@Req() req, @Res() res
    ) {
        return this.appService.postLogin(req, res);
    }

    //dashboard
    @Get('dashboard')
    @Render('dashboard')
    getDashboard() {
        return this.appService.getHello();
    }

//bil
    @Get('bills')
    @Render('listBill')
    getListBill() {
        return this.appService.getHello();
    }
}
