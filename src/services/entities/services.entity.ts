import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ServiceType } from './service-type.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column()
  price: number;

  @ManyToOne(() => ServiceType, serviceType => serviceType.services, { eager: true, nullable: false })
  serviceType: ServiceType;
}
