import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ type: 'varchar', length: 10 })
    telephone: number;
}
