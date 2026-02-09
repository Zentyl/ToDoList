import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Account } from './account.entity'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) { }

  getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  createTask(text: string, date: Date, priority: number): Promise<Task> {
    const newTask = this.taskRepository.create({ text, finished: false, date, priority });
    return this.taskRepository.save(newTask);
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    await this.taskRepository.update(id, updates);
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }

  getAllAccounts(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async createAccount(login: string, passwordPlain: string, email: string): Promise<Account> {
    const existingUser = await this.accountRepository.findOne({
      where: [
        { login: login },
        { email: email }
      ]
    });

    if (existingUser) {
      throw new Error('Użytkownik o takim loginie lub emailu już istnieje!');
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(passwordPlain, saltRounds);

    const newAccount = this.accountRepository.create({ login, password: hashedPassword, email });
    return this.accountRepository.save(newAccount);
  }
}
