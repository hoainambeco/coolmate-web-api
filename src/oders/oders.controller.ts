import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OdersService } from './oders.service';
import { CreateOderDto } from './dto/create-oder.dto';
import { UpdateOderDto } from './dto/update-oder.dto';

@Controller('oders')
export class OdersController {
  constructor(private readonly odersService: OdersService) {}

  @Post()
  create(@Body() createOderDto: CreateOderDto) {
    return this.odersService.create(createOderDto);
  }

  @Get()
  findAll() {
    return this.odersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.odersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOderDto: UpdateOderDto) {
    return this.odersService.update(+id, updateOderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.odersService.remove(+id);
  }
}
