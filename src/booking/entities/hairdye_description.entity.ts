import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class HairDyeDescription {
  @PrimaryGeneratedColumn('uuid')
  hdid: string;

  @Column()
  color: string;

  // @Column()
  // brand: string;

  @Column()
  hairDyeDetails: string;
}