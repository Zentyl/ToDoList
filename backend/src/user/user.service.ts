import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findOneByLogin(login: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { login } });
    }

    async findOneByLoginOrEmail(login: string, email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: [
                { login: login },
                { email: email }
            ]
        });
    }

    async createUser(details: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(details);
        return this.userRepository.save(newUser);
    }

    async updateUser(id: number, updates: Partial<User>): Promise<void> {
        const dataToUpdate = { ...updates };

        if (dataToUpdate.password && dataToUpdate.password.trim() !== "") {
            const saltRounds = 10;
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, saltRounds);
        }
        else {
            delete dataToUpdate.password;
        }

        await this.userRepository.update(id, dataToUpdate);
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async getAllUsers() {
        return this.userRepository.find();
    }

}
