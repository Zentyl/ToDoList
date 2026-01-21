import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("tasks")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getTasks() {
    return this.appService.getAllTasks();
  }

  @Post()
  createTask(
    @Body("text") text: string,
    @Body("date") date: Date) {
    const taskDate = date;
    return this.appService.createTask(text, taskDate);
  }

  @Patch(":id")
  updateTask(@Param("id") id: string, @Body() body: any) {
    return this.appService.updateTask(Number(id), body);
  }

  @Delete(":id")
  deleteTask(@Param("id") id: string) {
    return this.appService.deleteTask(Number(id));
  }
}
