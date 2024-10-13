import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/services.entity';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServiceType } from './entities/service-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceType])],
  providers: [ServicesService],
  controllers: [ServicesController],
})
export class ServiceModule {}
