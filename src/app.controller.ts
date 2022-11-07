import {Controller, Get, Param, Post, Render, Req, Res, Session} from "@nestjs/common";
import {AppService} from './app.service';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('web')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
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
    postAddProduct(@Req() req, @Res() res
    ) {
        return this.appService.postAddProduct(req, res);
    }
    @Get('productDetail/:id')
    getDetailProduct(@Req() req, @Res() res,@Param('id') param) {
        return this.appService.getDetailProduct(req,res,param);
    }
    @Post('/searchProduct')
    postSearchProduct(@Req() req, @Res() res
    ) {
        return this.appService.postSearchProduct(req, res);
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

    @Get('user-Info')
    @Render('userInfo')
    showUserInfo() {
        return this.appService.getHello();
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
