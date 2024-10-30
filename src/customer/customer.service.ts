import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    private readonly logger: Logger
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existingEmail = await this.findEmailOne(createCustomerDto.email);
    if (existingEmail) {
      this.logger.error(`BadRequest: ${createCustomerDto.email} email already exists`);
      throw new HttpException(
        'Email already exists', 
        HttpStatus.BAD_REQUEST,
      );
    }

    const customer = this.customerRepository.create(createCustomerDto);

    this.logger.log(`Success: saved ${customer.fullname} customer, id=${customer.id}`);
    return await this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { id } });
  }

  async findEmailOne(email: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { email } });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    if (!customer) {
      this.logger.error(`NotFoundException: customer not found, id=${id}`);
      throw new NotFoundException();
    }

    Object.assign(customer, updateCustomerDto);

    this.logger.log(`Success: updated ${customer.fullname} customer, id=${customer.id}`);
    return await this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<Customer> {
    const customer = await this.findOne(id);
    if (!customer) {
      this.logger.error(`NotFoundException: customer not found, id=${id}`);
      throw new NotFoundException();
    }

    this.logger.log(`Success: removed ${customer.fullname} customer, id=${customer.id}`);
    return await this.customerRepository.remove(customer);
  }
}
