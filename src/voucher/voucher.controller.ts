import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Put } from "@nestjs/common";
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthUserInterceptor } from "../interceptors/auth-user.interceptor";

@ApiTags('Voucher')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
@Controller('api/voucher')
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.create(createVoucherDto);
  }

  @Get()
  findAll() {
    return this.voucherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.voucherService.update(+id, updateVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherService.remove(+id);
  }
}
