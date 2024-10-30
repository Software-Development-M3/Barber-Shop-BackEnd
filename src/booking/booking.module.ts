import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { CustomerServices } from './entities/customerservice.entity';
import { HairCutDescription } from './entities/haircut_description.entity';
import { HairWashDescription } from './entities/hairwash_description.entity';
import { HairDyeDescription } from './entities/hairdye_description.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Service } from 'src/shop/entities/service.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Barber } from 'src/shop/entities/barber.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      CustomerServices,
      HairCutDescription,
      HairWashDescription,
      HairDyeDescription,
      Service,
      Shop,
      Barber,
      Customer,
    ]),AuthModule,
  ],
  providers: [BookingService, AppService, Logger],
  controllers: [BookingController],
})
export class BookingModule {}
