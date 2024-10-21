import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from './dto/login.dto';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';
import { Customer } from 'src/customer/entities/customer.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
    private configService: ConfigService
) {}

  async register(register: CreateCustomerDto): Promise<{ access_token: string }> {
    const customer: Customer = await this.customerService.create(register);

    const payload = { sub: customer.id, name: customer.fullname};
    return {
        access_token: await this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_SECRET') })
    };
  }

  async login(login: LoginDto): Promise<{ access_token: string }> {
    const customer = await this.customerService.findEmailOne(login.email);
    if (!customer) {
      throw new NotFoundException();
    }
    if (customer.password !== login.password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: customer.id, name: customer.fullname};
    return {
        access_token: await this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_SECRET') })
    };
  }

  async validate(payload: { sub: string, name: string }): Promise<{ customerid: string, fullname: string }> {
    return { customerid: payload.sub, fullname: payload.name };
  }
}