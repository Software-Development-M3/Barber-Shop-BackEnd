import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get('find')
  findAll() {
    return this.customerService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch('update/:id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
