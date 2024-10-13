import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('create')
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get('find')
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: number) {
    return this.servicesService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.servicesService.remove(id);
  }
}
