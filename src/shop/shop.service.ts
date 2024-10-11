import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Barber } from './entities/barber.entity'; 
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Barber) private readonly barberRepository: Repository<Barber>, 
  ) {}

  async create(createShopDto: CreateShopDto): Promise<Shop> {
    const { barbers, services, ...shopData } = createShopDto;

    const shop = this.shopRepository.create(shopData);
    const savedShop = await this.shopRepository.save(shop);

    if (barbers && barbers.length > 0) {
      const barberEntities = barbers.map((barberDto) => {
        const barber = this.barberRepository.create({ ...barberDto, shop: savedShop });
        return barber;
      });
      await this.barberRepository.save(barberEntities);
    }

    if (services && services.length > 0) {
      const serviceEntities = services.map((serviceDto) => {
        const service = this.serviceRepository.create({ ...serviceDto, shop: savedShop });
        return service;
      });
      await this.serviceRepository.save(serviceEntities);
    }

    return savedShop;
  }

  async update(id: string, updateShopDto: UpdateShopDto): Promise<Shop> {
    const { barbers, services, ...shopData } = updateShopDto;
  
    const shop = await this.shopRepository.findOne({ where: { id }, relations: ['barbers', 'services'] });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
  
    Object.assign(shop, shopData);
    const updatedShop = await this.shopRepository.save(shop);
  
    if (barbers) {
      const barberIds = barbers.map(barber => barber.name);
      const barbersToRemove = shop.barbers.filter(barber => !barberIds.includes(barber.name));
      if (barbersToRemove.length > 0) {
        await this.barberRepository.remove(barbersToRemove);
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
    }
  
    if (services) {
      const serviceIds = services.map(service => service.name);
      const servicesToRemove = shop.services.filter(service => !serviceIds.includes(service.name));
      if (servicesToRemove.length > 0) {
        await this.serviceRepository.remove(servicesToRemove);
      }
      const updatedServices = services.map(serviceDto => {
        const existingService = shop.services.find(service => service.name === serviceDto.name);
        if (existingService) {
          Object.assign(existingService, serviceDto);
          return existingService;
        } else {
          return this.serviceRepository.create({ ...serviceDto, shop: updatedShop });
        }
      });
      await this.serviceRepository.save(updatedServices);
    }
  
    return updatedShop;
  }
  
  

  async addService(shopId: string, createServiceDto: CreateServiceDto): Promise<Service> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const service = this.serviceRepository.create({ ...createServiceDto, shop });
    return this.serviceRepository.save(service);
  }

  async removeService(shopId: string, serviceId: string): Promise<void> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const service = await this.serviceRepository.findOne({ where: { id: serviceId, shop } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.serviceRepository.remove(service);
  }

  async findAll(): Promise<Shop[]> {
    return await this.shopRepository.find({ relations: ['barbers' , 'services']}); 
  }

  async findOne(id: string): Promise<Shop | null> {
    return await this.shopRepository.findOne({ where: { id }, relations: ['barbers','services'] }); 
  }

  
  async remove(id: string): Promise<Shop> {
    const shop = await this.findOne(id);
    if (!shop) {
      throw new NotFoundException();
    }

    return await this.shopRepository.remove(shop);
  }

  async removeBarber(shopId: string, barberId: string): Promise<void> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId }, relations: ['barbers'] });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const barber = await this.barberRepository.findOne({ where: { id: barberId, shop } });
    if (!barber) {
      throw new NotFoundException('Barber not found in this shop');
    }

    await this.barberRepository.remove(barber);
  }


}
