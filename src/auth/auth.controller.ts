import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() registerDto: CreateCustomerDto) {
    return this.authService.register(registerDto);
  }
}
