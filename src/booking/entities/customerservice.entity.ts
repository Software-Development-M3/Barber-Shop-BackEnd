import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    OneToOne,
    JoinColumn,
    Repository,
  } from 'typeorm';
  import { Booking } from './booking.entity';
  import { Service } from 'src/shop/entities/service.entity';
  import { HairCutDescription } from './haircut_description.entity';
  import { HairWashDescription } from './hairwash_description.entity';
  import { HairDyeDescription } from './hairdye_description.entity';
  
  @Entity()
  export class CustomerServices {
    @PrimaryGeneratedColumn('uuid')
    csid: string;
  
    @ManyToOne(() => Booking, booking => booking.customerServices, {onDelete : 'CASCADE'})
    @JoinColumn({ name: 'bookid' })
    booking: Booking;
  
    @ManyToOne(() => Service)
    @JoinColumn({ name: 'serviceid' })
    service: Service;
  
    @Column({ nullable: true })
    details: string;
  
    @OneToOne(() => HairCutDescription, { nullable: true, cascade: true, onDelete : 'CASCADE' })
    @JoinColumn({ name: 'hcdescriptionid' })
    hairCutDescription?: HairCutDescription;
  
    @OneToOne(() => HairWashDescription, { nullable: true, cascade: true, onDelete : 'CASCADE' })
    @JoinColumn({ name: 'hwdescriptionid' })
    hairWashDescription?: HairWashDescription;
  
    @OneToOne(() => HairDyeDescription, { nullable: true, cascade: true, onDelete : 'CASCADE' })
    @JoinColumn({ name: 'hddescriptionid' })
    hairDyeDescription?: HairDyeDescription;
  }