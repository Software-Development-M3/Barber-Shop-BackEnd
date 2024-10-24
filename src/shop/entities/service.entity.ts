import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Shop } from './shop.entity';
// import { ServiceType } from './service-type.entity';

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

    @Column({ type: 'int'})
    serviceTypeId: number;

    @ManyToOne(() => Shop, (shop) => shop.services, {onDelete : "CASCADE"})
    shop: Shop;
}
