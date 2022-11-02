import {Controller, Get, Post, Render, Req, Res} from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('listProduct')
  root() {
    return this.appService.getHello();
  }
  @Get('product')
  @Render('listProduct')
  getListProduct() {
    return this.appService.getHello();
  }
  @Get('product-add')
  @Render('addProduct')
  addProduct() {
    return this.appService.getHello();
  }
  @Get('profile')
  @Render('profile')
  getProfile() {
    return this.appService.getHello();
  }
  //user
  @Get('users')
  @Render('listUser')
  getListUser() {
    return this.appService.getHello();
  }
  @Get('user-Info')
  @Render('userInfo')
  showUserInfo() {
    return this.appService.getHello();
  }
  //login
  @Get('login')
  @Render('login')
  getlogin(@Req() req,@Res() res
  ) {
    return this.appService.getLogin(req, res);
  }
  @Post('login')
  @Render('login')
  postlogin(@Req() req,@Res() res
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
