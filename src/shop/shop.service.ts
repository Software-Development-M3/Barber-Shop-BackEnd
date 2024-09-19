import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>,
  ) {}

  async create(createShopDto: CreateShopDto): Promise<Shop> {
    const shop = this.shopRepository.create(createShopDto);
    
    return await this.shopRepository.save(shop);
  }

  async findAll(): Promise<Shop[]> {
    return await this.shopRepository.find();
  }

  async findOne(id: string): Promise<Shop | null> {
    return await this.shopRepository.findOne({ where: { id } });
  }

  async update(id: string, updateShopDto: UpdateShopDto): Promise<Shop> {
    const shop = await this.findOne(id);
    if (!shop) {
      throw new NotFoundException();
    }

    Object.assign(shop, updateShopDto);
    
    return await this.shopRepository.save(shop);
  }

  async remove(id: string): Promise<Shop> {
    const shop = await this.findOne(id);
    if (!shop) {
      throw new NotFoundException();
    }

    return await this.shopRepository.remove(shop);
  }
}
