import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  createTask(text: string, date: Date): Promise<Task> {
    const newTask = this.taskRepository.create({ text, finished: false , date });
    return this.taskRepository.save(newTask);
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    await this.taskRepository.update(id, updates);
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
