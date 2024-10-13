import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Barber } from './barber.entity';
import { Service } from './service.entity';

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

  @Column({ type: 'varchar', length: 100 })
  tags: [];

  @Column({ type: 'varchar', length: 20 })
  timeOpen: string;

  @Column({ type: 'varchar', length: 20 })
  timeClose: string;

  @OneToMany(() => Barber, (barber) => barber.shop)
  barbers: Barber[];

  @OneToMany(() => Service, (service) => service.shop)
  services: Service[];
}
