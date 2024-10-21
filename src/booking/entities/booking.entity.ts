import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn,} from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { Barber } from 'src/shop/entities/barber.entity';
import { CustomerServices } from './customerservice.entity';
  
  @Entity()
  export class Booking {
    @PrimaryGeneratedColumn('uuid')
    bookid: string;
  
    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'cid' })
    customer: Customer;
  
    @ManyToOne(() => Shop)
    @JoinColumn({ name: 'shopid' })
    shop: Shop;
  
    @ManyToOne(() => Barber)
    @JoinColumn({ name: 'barberid' })
    barber: Barber;
  
    // @Column()
    // bookTime: Date;

    @Column()
    startTime: string;

    @Column()
    endTime: string;
  
    @Column()
    totalDuration: number;
  
    @Column()
    totalPrice: number;
  
    @OneToMany(() => CustomerServices, customerService => customerService.booking, {onDelete: 'CASCADE',})
    customerServices: CustomerServices[];
  }