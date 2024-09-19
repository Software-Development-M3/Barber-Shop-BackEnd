import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto);
  }

  @Get()
  findAll() {
    return this.shopService.findAll();
  }

  @Get('search/id/:id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @Patch('update/id/:id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.update(id, updateShopDto);
  }

  @Delete('delete/id/:id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(id);
  }
}
