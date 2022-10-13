import { Controller, Get, Render } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('addProduct')
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
  @Get('users')
  @Render('listUser')
  getListUser() {
    return this.appService.getHello();
  }
  @Get('login')
  @Render('login')
  getlogin() {
    return this.appService.getHello();
  }
}
