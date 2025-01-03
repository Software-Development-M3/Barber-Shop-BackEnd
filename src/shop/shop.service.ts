import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Barber } from './entities/barber.entity'; 
import { Service } from './entities/service.entity';
import { ILike, Repository } from 'typeorm';
import { ServiceType } from 'src/utils/servicetype';
import { AppService } from 'src/app.service';


@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Barber) private readonly barberRepository: Repository<Barber>, 
    private readonly appService: AppService,
    private readonly logger: Logger
  ) {}

  async create(createShopDto: CreateShopDto): Promise<Shop> {
    const { barbers, services, ...shopData } = createShopDto;

    const shop = this.shopRepository.create(shopData);
    const savedShop = await this.shopRepository.save(shop);
    this.logger.log(`Success: saved ${savedShop.name} shop, id=${shop.id}`);

    if (barbers && barbers.length > 0) {
      const barberEntities = barbers.map((barberDto) => {
        const barber = this.barberRepository.create({ ...barberDto, shop: savedShop });
        return barber;
      });
      await this.barberRepository.save(barberEntities);
      this.logger.log(`Success: saved ${barberEntities.length} barber entities, id=${barberEntities.map(bar => bar.id).join(', ')}`);
    }

    if (services && services.length > 0) {
      const serviceEntities = await Promise.all(
        services.map(async (createServiceDto) => {
          if (!ServiceType.hasOwnProperty(createServiceDto.serviceTypeId)) {
            this.logger.error(`NotFoundException: ${createServiceDto.name} service, ServiceType not found, id=${createServiceDto.serviceTypeId}`);
            throw new NotFoundException('ServiceType not found');
          }
          const service = this.serviceRepository.create({ ...createServiceDto, shop: savedShop });
          return service;
        }),
      );
      await this.serviceRepository.save(serviceEntities);
      this.logger.log(`Success: saved ${serviceEntities.length} service entities, id=${serviceEntities.map(ser => ser.id).join(', ')}`);
    }

    return savedShop;
  }

  async update(id: string, updateShopDto: UpdateShopDto): Promise<Shop> {
    const { barbers, services, ...shopData } = updateShopDto;
  
    const shop = await this.shopRepository.findOne({ where: { id }, relations: ['barbers', 'services'] });
    if (!shop) {
      this.logger.error(`NotFoundException: shop not found, id=${id}`);
      throw new NotFoundException('Shop not found');
    }
  
    Object.assign(shop, shopData);
    const updatedShop = await this.shopRepository.save(shop);
    this.logger.log(`Success: updated ${updatedShop.name} shop, id=${updatedShop.id}`);
  
    if (barbers) {
      const barberIds = barbers.map(barber => barber.name);
      const barbersToRemove = shop.barbers.filter(barber => !barberIds.includes(barber.name));
      if (barbersToRemove.length > 0) {
        await this.barberRepository.remove(barbersToRemove);
        this.logger.log(`Success: removed ${barbersToRemove.length} barber entities, id=${barbersToRemove.map(bar => bar.id).join(', ')}`);
      }
      const updatedBarbers = barbers.map(barberDto => {
        const existingBarber = shop.barbers.find(barber => barber.name === barberDto.name);
        if (existingBarber) {
          Object.assign(existingBarber, barberDto);
          return existingBarber;
        } else {
          return this.barberRepository.create({ ...barberDto, shop: updatedShop });
        }
      });
      await this.barberRepository.save(updatedBarbers);
      this.logger.log(`Success: updated ${updatedBarbers.length} barber entities, id=${updatedBarbers.map(bar => bar.id).join(', ')}`);
    }
  
    if (services) {
      const serviceIds = services.map(service => service.name);
      const servicesToRemove = shop.services.filter(service => !serviceIds.includes(service.name));
      if (servicesToRemove.length > 0) {
        await this.serviceRepository.remove(servicesToRemove);
        this.logger.log(`Success: removed ${servicesToRemove.length} service entities, id=${servicesToRemove.map(ser => ser.id).join(', ')}`);
      }
      const updatedServices = services.map(async createserviceDto => {
        const existingService = shop.services.find(service => service.name === createserviceDto.name);
        if (!ServiceType.hasOwnProperty(createserviceDto.serviceTypeId)) {
          this.logger.error(`NotFoundException: ${createserviceDto.name} service, ServiceType not found = id${createserviceDto.serviceTypeId}`);
          throw new NotFoundException('ServiceType not found');
        }
        if (existingService) {
          const {name,duration,price,serviceTypeId} = createserviceDto;
          Object.assign(existingService, { name, duration, price, serviceTypeId });
          return await this.serviceRepository.save(existingService);
        } else {
          return this.serviceRepository.create({ ...createserviceDto, shop: updatedShop });
        }
      });
      await this.serviceRepository.save(await Promise.all(updatedServices));
      this.logger.log(`Success: updated ${updatedServices.length} barber entities`);
    }
  
    return updatedShop;
  }
  
  

  async addService(shopId: string, createServiceDto: CreateServiceDto): Promise<Service> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      this.logger.error(`NotFoundException: shop not found, id=${shopId}`);
      throw new NotFoundException('Shop not found');
    }

    if (!ServiceType.hasOwnProperty(createServiceDto.serviceTypeId)) {
      this.logger.error(`NotFoundException: ${createServiceDto.name} service, ServiceType not found = id${createServiceDto.serviceTypeId}`);
      throw new NotFoundException('ServiceType not found');
    }

    const service = this.serviceRepository.create({ ...createServiceDto, shop });
    this.logger.log(`Success: saved ${service.name} service entities, id=${service.id}`);
    return this.serviceRepository.save(service);
  }

  async removeService(shopId: string, id: number): Promise<void> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      this.logger.error(`NotFoundException: shop not found, id=${shopId}`);
      throw new NotFoundException('Shop not found');
    }

    const service = await this.serviceRepository.findOne({ where: { id, shop } });
    if (!service) {
      this.logger.error(`NotFoundException: service not found, id=${id}`);
      throw new NotFoundException('Service not found');
    }

    await this.serviceRepository.remove(service);
    this.logger.log(`Success: removed ${service.name} service, id=${service.id}`);
  }

  async findAll(): Promise<Shop[]> {
    return await this.shopRepository.find({ }); 
    // relations: ['barbers' , 'services']
  }

  async findOne(id: string): Promise<Shop | null> {
    return await this.shopRepository.findOne({ where: { id } , relations: ['barbers','services', 'bookings']}); 
    
  }

  async getServicesByShopId(shopId: string): Promise<any> {
    const shop = await this.shopRepository.findOne({
        where: { id: shopId },
        relations: ['services']
    });

    if (!shop) {
      this.logger.error(`NotFoundException: shop not found, id=${shopId}`);
        throw new NotFoundException('Shop not found');
    }

    // Structure the response
    const serviceMap = {};
    // const colors = ["ทอง", "เขียว", "แดง"]
    // const shampoos = ["L'OREAL Paris", "Herbal Esesences", "ดอกบัวขี้"]
    for (const service of shop.services) {
        const serviceTypeName = ServiceType[service.serviceTypeId].toLowerCase().replace(/\s+/g, ''); // Normalize service type name

        // Initialize the service type array if it doesn't exist
        if (!serviceMap[serviceTypeName]) {
            serviceMap[serviceTypeName] = [];
        }

        // Push the service details into the respective service type array
        serviceMap[serviceTypeName].push({
            serviceId: service.id,
            serviceName: service.name,
            duration: service.duration,
            price: service.price
        });
        
        
        
    }
    //mockup ข้อมูลมานะ ทำต่อด้วย
    serviceMap["colors"] = shop.colors
    serviceMap["shampoos"] = shop.shampoos

    return serviceMap;
}

  async getBarbersByShopId(shopId: string): Promise<Array<Barber>> {
    const shop = await this.shopRepository.findOne({
      where: { id: shopId },
      relations: ['barbers']
    });

    if (!shop) {
      this.logger.error(`NotFoundException: shop not found, id=${shopId}`);
        throw new NotFoundException('Shop not found');
    }

    return shop.barbers;
  }

  async getScheduleByShopId(shopId: string): Promise<{
    [date: string]: {
      [barber: string]: Array<{
        bookid: string;
        startTime: string;
        endTime: string;
        totalDuration: number;
        serviceType: string[];
        serviceName: string[];
      }>;
    };
  }> {
    const shop = await this.shopRepository.findOne({
      where: { id: shopId },
      relations: ['barbers', 'bookings', 'bookings.barber', 'bookings.customerServices', 'bookings.customerServices.service']
    });

    if (!shop) {
      this.logger.error(`NotFoundException: shop not found, id=${shopId}`);
        throw new NotFoundException('Shop not found');
    }

    var offset = 0;
    const today = new Date();
    if (today > this.appService.deformatTimeString(shop.timeClose, today)) {
      offset = 1;
    }

    const scheduleMap = { };
    const week = this.appService.getWeek(offset);
    for (const date of week) {
      scheduleMap[date] = { };
      for (const barber of shop.barbers) {
        scheduleMap[date][barber.name] = [];
      }
    }

    for (const booking of shop.bookings) {
      const bookdate = booking.startTime.split('T')[0];
      const barber = booking.barber.name;
      
      if (scheduleMap[bookdate]) {
        scheduleMap[bookdate][barber].push({
          bookid: booking.bookid,
          startTime: booking.startTime,
          endTime: booking.endTime,
          totalDuration: booking.totalDuration,
          serviceType: booking.customerServices.map(serv => ServiceType[serv.service.serviceTypeId]),
          serviceName: booking.customerServices.map(serv => serv.service.name),
        });
      }
    }

    return scheduleMap;
  }

  async findByName(name: string): Promise<Shop[] | null> {
    return await this.shopRepository.find({
      where: { name: ILike(`%${name}%`) },
      // relations: ['barbers', 'services'], 
    });
  }
  
  async remove(id: string): Promise<Shop> {
    const shop = await this.findOne(id);
    if (!shop) {
      this.logger.error(`NotFoundException: shop not found, id=${id}`);
      throw new NotFoundException();
    }

    this.logger.log(`Success: removed ${shop.name} barber, id=${shop.id}`);
    return await this.shopRepository.remove(shop);
  }

  async removeBarber(shopId: string, barberId: string): Promise<void> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId }, relations: ['barbers'] });
    if (!shop) {
      this.logger.error(`NotFoundException: shop not found, id=${shopId}`);
      throw new NotFoundException('Shop not found');
    }

    const barber = await this.barberRepository.findOne({ where: { id: barberId, shop } });
    if (!barber) {
      this.logger.error(`NotFoundException: barber not found, id=${barberId}`);
      throw new NotFoundException('Barber not found in this shop');
    }

    await this.barberRepository.remove(barber);
    this.logger.log(`Success: removed ${barber.name} barber, id=${barber.id}`);
  }

  async getAvailableBookingTime(
    shopId: string, breakStartString: string="12:00", breakEndString: string="13:00") : Promise<{
      [date: string]: {
        [barber: string]: Array<{ 
          longestFreeDuration: number, 
          freeSlot: Array<{ 
            start: string, 
            end: string, 
            duration: number 
        }>;
      }>;
    }
  }>
  {
    const shopSchedule = await this.getScheduleByShopId(shopId);
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });

    const freeSchedule = { };
    const today = new Date();

    for (const date in shopSchedule) {
      freeSchedule[date] = { };
      const thisDate = this.appService.deformatDateString(date);
      const openTime = this.appService.deformatTimeString(shop.timeOpen, thisDate);
      const closeTime = this.appService.deformatTimeString(shop.timeClose, thisDate);

      if (today.getDate() === openTime.getDate() && today.getMonth() === openTime.getMonth() && today.getFullYear() === openTime.getFullYear()) {
        openTime.setHours(today.getHours() + 1);
        openTime.setMinutes(today.getMinutes());

        if (openTime > closeTime) {
          openTime.setHours(closeTime.getHours());
          openTime.setMinutes(closeTime.getMinutes());
        }
      }
      
      for (const barber in shopSchedule[date]) {
        freeSchedule[date][barber] = []
        const bookings = shopSchedule[date][barber];
        const timeSlot: Array<{ start: Date, end: Date }> = bookings.map(slot => ({
          start: this.appService.deformatDateTimeString(slot.startTime),
          end: this.appService.deformatDateTimeString(slot.endTime),
        }));
        timeSlot.sort((a, b) => a.start.getTime() - b.start.getTime());

        const freeSlot: Array<{ start: string, end: string, duration: number }> = [];

        const breakStart = this.appService.deformatTimeString(breakStartString, thisDate);
        const breakEnd = this.appService.deformatTimeString(breakEndString, thisDate);
        const getFreeDuration = (start: Date, end: Date): number => {
          if (end <= breakStart || start >= breakEnd) {
            const duration = (end.getTime() - start.getTime()) / (1000 * 60);
            const newFreeSlot = { start: this.appService.getFormatDateTime(start), end: this.appService.getFormatDateTime(end), duration: duration };
            freeSlot.push(newFreeSlot);

            return duration;
          }
          else {
            const durationBeforeBreak = (breakStart.getTime() - start.getTime()) / (1000 * 60);
            const durationAfterBreak = (end.getTime() - breakEnd.getTime()) / (1000 * 60);
            if (durationBeforeBreak > 0) {
              const newFreeSlotBefore = { start: this.appService.getFormatDateTime(start), end: this.appService.getFormatDateTime(breakStart), duration: durationBeforeBreak };
              freeSlot.push(newFreeSlotBefore);
            }
            if (durationAfterBreak > 0) {
              const newFreeSlotAfter = { start: this.appService.getFormatDateTime(breakEnd), end: this.appService.getFormatDateTime(end), duration: durationAfterBreak };
              freeSlot.push(newFreeSlotAfter);
            }

            return Math.max(durationBeforeBreak, durationAfterBreak);
          }
        }

        let longestDuration = 0;
        let lastEndTime = openTime;

        for (const slot of timeSlot) {
          if (slot.start > lastEndTime) {
            const freeDuration = getFreeDuration(lastEndTime, slot.start)
            longestDuration = Math.max(longestDuration, freeDuration);
          }
          lastEndTime = slot.end > lastEndTime ? slot.end : lastEndTime;
        }
        if (lastEndTime < closeTime) {
          const freeDuration = getFreeDuration(lastEndTime, closeTime);
          longestDuration = Math.max(longestDuration, freeDuration);
        }

        freeSchedule[date][barber].push({ longestFreeDuration: longestDuration, freeSlot: freeSlot });
      }
    }
    return freeSchedule;
  }

}
