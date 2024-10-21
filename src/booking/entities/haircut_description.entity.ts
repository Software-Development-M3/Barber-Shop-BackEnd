import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class HairCutDescription {
  @PrimaryGeneratedColumn('uuid')
  hcid: string;

  @Column()
  style: string;

  @Column()
  hairLength: string;

  @Column()
  hairCutDetails: string;
}
