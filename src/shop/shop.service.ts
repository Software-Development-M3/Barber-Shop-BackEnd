import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Barber } from './entities/barber.entity'; 
import { Service } from './entities/service.entity';
import { ILike, Repository } from 'typeorm';
import { ServiceType } from './entities/service-type.entity';


@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Barber) private readonly barberRepository: Repository<Barber>, 
    @InjectRepository(ServiceType) private readonly serviceTypeRepository: Repository<ServiceType>,
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
      const serviceEntities = await Promise.all(
        services.map(async (createServiceDto) => {
          const serviceType = await this.serviceTypeRepository.findOne({
            where: { id: createServiceDto.serviceTypeId },
          });

          if (!serviceType) {
            throw new NotFoundException('ServiceType not found');
          }

          const service = this.serviceRepository.create({ ...createServiceDto, serviceType, shop: savedShop });
          return service;
        }),
      );
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
      const updatedServices = services.map(async createserviceDto => {
        const existingService = shop.services.find(service => service.name === createserviceDto.name);
        const serviceType = await this.serviceTypeRepository.findOne({ where: { id: createserviceDto.serviceTypeId } });
        if (!serviceType) {
          throw new NotFoundException('ServiceType not found');
        }
        if (existingService) {
          const {name,duration,price,serviceTypeId} = createserviceDto;
          Object.assign(existingService, { name, duration, price, serviceType });
          return await this.serviceRepository.save(existingService);
        } else {
          return this.serviceRepository.create({ ...createserviceDto,serviceType, shop: updatedShop });
        }
      });
      await this.serviceRepository.save(await Promise.all(updatedServices));
    }
  
    return updatedShop;
  }
  
  

  async addService(shopId: string, createServiceDto: CreateServiceDto): Promise<Service> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id: createServiceDto.serviceTypeId },
    });

    if (!serviceType) {
      throw new NotFoundException('ServiceType not found');
    }

    const service = this.serviceRepository.create({ ...createServiceDto, serviceType, shop });
    return this.serviceRepository.save(service);
  }

  async removeService(shopId: string, id: number): Promise<void> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const service = await this.serviceRepository.findOne({ where: { id, shop } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.serviceRepository.remove(service);
  }

  async findAll(): Promise<Shop[]> {
    return await this.shopRepository.find({ }); 
    // relations: ['barbers' , 'services']
  }

  async findOne(id: string): Promise<Shop | null> {
    return await this.shopRepository.findOne({ where: { id } , relations: ['barbers','services']}); 
    
  }

  async getServicesByShopId(shopId: string): Promise<any> {
    const shop = await this.shopRepository.findOne({
        where: { id: shopId },
        relations: ['services', 'services.serviceType']
    });

    if (!shop) {
        throw new NotFoundException('Shop not found');
    }

    // Structure the response
    const serviceMap = {};
    // const colors = ["ทอง", "เขียว", "แดง"]
    // const shampoos = ["L'OREAL Paris", "Herbal Esesences", "ดอกบัวขี้"]
    for (const service of shop.services) {
        const serviceTypeName = service.serviceType.name.toLowerCase().replace(/\s+/g, ''); // Normalize service type name

        // Initialize the service type array if it doesn't exist
        if (!serviceMap[serviceTypeName]) {
            serviceMap[serviceTypeName] = [];
        }

        // Push the service details into the respective service type array
        serviceMap[serviceTypeName].push({
            serviceId: service.id,
            serviceName: service.name,
            time: service.duration,
            price: service.price
        });
        
        
        
    }
    //mockup ข้อมูลมานะ ทำต่อด้วย
    serviceMap["colors"] = shop.colors
    serviceMap["shampoos"] = shop.shampoos

    return serviceMap;
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
