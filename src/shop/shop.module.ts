import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { Shop } from './entities/shop.entity';
import { Barber } from './entities/barber.entity'; 
import { Service } from './entities/service.entity';
import { ServiceType } from './entities/service-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Barber , Service, ServiceType])],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
