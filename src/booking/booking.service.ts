import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CustomerServices } from './entities/customerservice.entity';
import { HairCutDescription } from './entities/haircut_description.entity';
import { HairWashDescription } from './entities/hairwash_description.entity';
import { HairDyeDescription } from './entities/hairdye_description.entity';
import { Service } from 'src/shop/entities/service.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Barber } from 'src/shop/entities/barber.entity';
import { CreateBookingDto } from './dto/creater-booking.dto';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(CustomerServices)
    private readonly customerServiceRepository: Repository<CustomerServices>,
    @InjectRepository(HairCutDescription)
    private readonly hairCutDescriptionRepository: Repository<HairCutDescription>,
    @InjectRepository(HairWashDescription)
    private readonly hairWashDescriptionRepository: Repository<HairWashDescription>,
    @InjectRepository(HairDyeDescription)
    private readonly hairDyeDescriptionRepository: Repository<HairDyeDescription>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto, reqid : string ): Promise<Booking> {
    const { shopId, services, barberId, price, timeTotal, date, startTime, endTime } = createBookingDto;
  
    // Find the shop using shopId (UUID)
    const shop = await this.shopRepository.findOne({ where: { id: shopId } }); // 'id' matches Shop entity
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
  
    // Find the barber using barberId (UUID)
    const barber = await this.barberRepository.findOne({ where: { id: barberId } }); // 'id' matches Barber entity
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }

    const customer = await this.customerRepository.findOne({ where: { id : reqid}});
  
    // Create a new booking
    const booking = this.bookingRepository.create({
      shop:shop,
      customer: customer,
      barber:barber,
      startTime: startTime,
      endTime: endTime, // Ensure date is formatted correctly
      totalDuration: timeTotal,
      totalPrice: price,
    });
  
    const savedBooking = await this.bookingRepository.save(booking);
  
    const customerServices: CustomerServices[] = [];
  
    // Handle HairCut service
    if (services.hairCut) {
      const service = await this.serviceRepository.findOne({ where: { id: services.hairCut.serviceId } }); // 'id' matches Service entity
      if (!service) {
        throw new NotFoundException('Service not found');
      }
  
      const hairCutDescription = this.hairCutDescriptionRepository.create({
        style: services.hairCut.style,
        hairLength: services.hairCut.hairLength,
        hairCutDetails: services.hairCut.additionalRequirement,
      });
  
      const customerService = this.customerServiceRepository.create({
        booking: savedBooking,
        service,
        hairCutDescription,
      });
      customerServices.push(customerService);
    }
  
    // Handle HairWash service
    if (services.hairWash) {
      const service = await this.serviceRepository.findOne({ where: { id: services.hairWash.serviceId } }); // 'id' matches Service entity
      if (!service) {
        throw new NotFoundException('Service not found');
      }
  
      const hairWashDescription = this.hairWashDescriptionRepository.create({
        // shampoo: services.hairWash.shampooType,
        brand : services.hairWash.brand,
        hairWashDetails: services.hairWash.additionalRequirement,
      });
  
      const customerService = this.customerServiceRepository.create({
        booking: savedBooking,
        service,
        hairWashDescription,
      });
      customerServices.push(customerService);
    }
  
    // Handle HairDye service
    if (services.hairDye) {
      const service = await this.serviceRepository.findOne({ where: { id: services.hairDye.serviceId } }); // 'id' matches Service entity
      if (!service) {
        throw new NotFoundException('Service not found');
      }
  
      const hairDyeDescription = this.hairDyeDescriptionRepository.create({
        color: services.hairDye.color,
        // brand: services.hairDye.brand,
        hairDyeDetails: services.hairDye.additionalRequirement,
      });
  
      const customerService = this.customerServiceRepository.create({
        booking: savedBooking,
        service,
        hairDyeDescription,
      });
      customerServices.push(customerService);
    }
  
    // Save all customer services
    await this.customerServiceRepository.save(customerServices);
  
    return savedBooking;
  }
  
  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find();
  }

  async findOne(id: string): Promise<Booking | null> {
    return await this.bookingRepository.findOne({ where: { bookid : id } });
  }

  async remove(id: string): Promise<Booking> {
    const customer = await this.findOne(id);
    if (!customer) {
      throw new NotFoundException();
    }

    return await this.bookingRepository.remove(customer);
  }
}

