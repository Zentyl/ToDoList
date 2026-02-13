import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../task/task.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ default: 'user' })
    role: string;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}