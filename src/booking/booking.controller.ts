import { Controller, Post, Body, Delete, UseGuards, Get, Param, Request } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/creater-booking.dto';
import { Booking } from './entities/booking.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req): Promise<Booking> {
    return this.bookingService.createBooking(createBookingDto, req.user["sub"]);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('search/id/:id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') bookid: string) {
    return this.bookingService.remove(bookid);
  }
}
