import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column({ default: false })
    finished: boolean;

    @Column({ type: 'datetime', nullable: true })
    date: Date;

    @Column({ default: 1 })
    priority: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.tasks, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: User;

};