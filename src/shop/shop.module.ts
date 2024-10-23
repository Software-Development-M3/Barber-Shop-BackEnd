import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { Shop } from './entities/shop.entity';
import { Barber } from './entities/barber.entity'; 
import { Service } from './entities/service.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Barber, Service, Booking])],
  controllers: [ShopController],
  providers: [ShopService, AppService],
})
export class ShopModule {}
