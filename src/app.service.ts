import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getLogin(req,res) {
    console.log(req.body)
    return {
      message: 'Hello World!',
    };
  }
  postLogin(req,res) {
    console.log(req.body)
    return {
      message: 'Hello World!',
    };
  }
  getHello() {
    return {
      message: 'Hello World!',
    };
  }

}
