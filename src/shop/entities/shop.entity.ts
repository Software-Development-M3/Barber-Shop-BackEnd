import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Barber } from './barber.entity';
import { Service } from './service.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Entity({ name: 'shop' })
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 200 })
  location: string;

  @Column({ type: 'varchar', length: 20 })
  telephone: number;

  @Column({ type: 'varchar', length: 500 })
  image: string;

  @Column({ type: 'simple-array', nullable:true})
  tags: [];

  @Column({ type: 'varchar', length: 20 })
  timeOpen: string;

  @Column({ type: 'varchar', length: 20 })
  timeClose: string;

  @OneToMany(() => Barber, (barber) => barber.shop , {onDelete : "CASCADE"})
  barbers: Barber[];

  @OneToMany(() => Service, (service) => service.shop, {onDelete : "CASCADE"})
  services: Service[];

  @OneToMany(() => Booking, (booking) => booking.shop, {onDelete : "CASCADE"})
  bookings: Booking[];

  @Column({ type: 'simple-array', nullable:true })
  colors: [];

  @Column({ type: 'simple-array', nullable:true })
  shampoos: [];
}
