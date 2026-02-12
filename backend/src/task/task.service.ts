import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) { }

  async getAllTasks(userId: number): Promise<Partial<Task>[]> {
    const tasks = await this.taskRepository.find({
      where: { userId: userId }
    });

    return tasks.map(({ userId, ...rest }) => rest);
  }

  createTask(text: string, date: Date, priority: number, userId: number): Promise<Task> {
    const newTask = this.taskRepository.create({ text, finished: false, date, priority, userId: userId });
    return this.taskRepository.save(newTask);
  }

  async updateTask(id: number, updates: Partial<Task>, userId: number): Promise<void> {
    const result = await this.taskRepository.update({ id, userId }, updates);

    if (result.affected === 0) {
      throw new NotFoundException(`Zadanie o ID ${id} nie istnieje lub nie należy do Ciebie.`);
    }
  }

  async deleteTask(id: number, userId: number): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException(`Zadanie o ID ${id} nie istnieje lub nie należy do Ciebie.`);
    }
  }

}
