import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'customer' })
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 40 })
    fullname: string;

    @Column({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({type: 'varchar', length: 10 })
    telephone: number;
}
