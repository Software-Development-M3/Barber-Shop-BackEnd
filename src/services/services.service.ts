import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/services.entity';
import { ServiceType } from './entities/service-type.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    // Check if the service type exists
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id: createServiceDto.serviceTypeId },
    });

    if (!serviceType) {
      throw new NotFoundException('ServiceType not found');
    }

    const service = this.serviceRepository.create({
      ...createServiceDto,
      serviceType, // Link the service type
    });

    return this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    try {
      return await this.serviceRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error finding services');
    }
  }

    async findOne(id: number): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id }, relations: ['serviceType'] });
      if (!service) {
        throw new NotFoundException(`Service with id ${id} not found`);
      }
      return service;
    } catch (error) {
      throw new InternalServerErrorException('Error finding service');
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.findOne( { where: {id : id} } );

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id: updateServiceDto.serviceTypeId },
    });

    if (!serviceType) {
      throw new NotFoundException('Service type not found');
    }
    const {name,duration,price,serviceTypeId} = updateServiceDto;
    await this.serviceRepository.update(id,{name:name,duration:duration,price:price,serviceType:serviceType});

    return this.serviceRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    const result = await this.serviceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
  }
}
