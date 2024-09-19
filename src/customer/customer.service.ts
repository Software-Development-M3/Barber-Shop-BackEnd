import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);

    return await this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    if (!customer) {
      throw new NotFoundException();
    }

    Object.assign(customer, updateCustomerDto);

    return await this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<Customer> {
    const customer = await this.findOne(id);
    if (!customer) {
      throw new NotFoundException();
    }

    return await this.customerRepository.remove(customer);
  }
}
