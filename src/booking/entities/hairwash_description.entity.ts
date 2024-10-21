import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class HairWashDescription {
  @PrimaryGeneratedColumn('uuid')
  hwid: string;

  // @Column()
  // shampoo: string;

  @Column()
  brand: string;

  @Column()
  hairWashDetails: string;
}