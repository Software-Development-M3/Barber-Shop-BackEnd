import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 30 })
    name: string;

    @Column({ type: 'varchar', length: 40 })
    email: string;

    @Column({ type: 'varchar'})
    password: string;

    @Column({type: 'varchar', length: 10})
    telephone: number;
}
