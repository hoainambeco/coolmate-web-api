import { Controller, Get, Render, Req, Res } from "@nestjs/common";
import { BichNgocService } from './bich-ngoc.service';

@Controller('bich-ngoc')
export class BichNgocController {
  constructor(private readonly bichNgocService: BichNgocService) {}
  @Get()
  @Render('bich-ngoc')
  getListUser(@Req() req, @Res() res) {
    return
  }
}
