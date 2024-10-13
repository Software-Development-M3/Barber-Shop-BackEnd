import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Shop } from './shop.entity';

@Entity({ name: 'service' })
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'int'})
    price: number;

    @ManyToOne(() => Shop, (shop) => shop.services)
    shop: Shop;
}
