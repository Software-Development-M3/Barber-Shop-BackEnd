import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Shop } from './shop.entity';
import { ServiceType } from './service-type.entity';

@Entity({ name: 'service' })
export class Service {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    name: string;

    @Column({ type: 'int'})
    duration: number;

    @Column({ type: 'int'})
    price: number;

    @ManyToOne(() => ServiceType, serviceType => serviceType.services, { eager: true, nullable: false })
    serviceType: ServiceType;

    @ManyToOne(() => Shop, (shop) => shop.services)
    shop: Shop;
}
