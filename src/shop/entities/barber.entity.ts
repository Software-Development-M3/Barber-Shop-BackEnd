import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Shop } from "./shop.entity";

@Entity({ name: 'barber' })
export class Barber {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'int' })
    experience: number;

    @Column({ type: 'varchar', length: 50 })
    specialization: string;

    @ManyToOne(() => Shop, (shop) => shop.barbers)
    shop: Shop;
}
