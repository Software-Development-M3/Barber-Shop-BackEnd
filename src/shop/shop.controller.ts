import { Controller, Get, Post, Patch, Param, Delete, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto);
  }

  @Post(':shopId/service')
  @UsePipes(ValidationPipe)
  addService(@Param('shopId') shopId: string, @Body() createServiceDto: CreateServiceDto) {
    return this.shopService.addService(shopId, createServiceDto);
  }

  @Patch('update/id/:id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
  return this.shopService.update(id, updateShopDto);
  }

  @Get()
  findAll() {
    return this.shopService.findAll();
  }

  @Get('search/id/:id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @Get('search/name/:name')
  findbyname(@Param('name') name: string) {
    return this.shopService.findByName(name);
  }

  @Delete('delete/id/:id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(id);
  }

  @Delete(':shopId/service/:serviceId')
  removeService(@Param('shopId') shopId: string, @Param('serviceId') serviceId: string) {
    return this.shopService.removeService(shopId, serviceId);
  }

  @Delete(':shopId/barber/:barberId')
  removeBarber(@Param('shopId') shopId: string, @Param('barberId') barberId: string) {
    return this.shopService.removeBarber(shopId, barberId);
  }
}
