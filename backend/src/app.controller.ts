import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller("tasks")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getTasks() {
    return this.appService.getAllTasks();
  }

  @Post()
  createTask(
    @Body("text") text: string,
    @Body("priority") priority: number,
    @Body("date") date: Date
  ) {
    return this.appService.createTask(text, date, priority);
  }

  @Patch(":id")
  updateTask(@Param("id", ParseIntPipe) id: number, @Body() body: any) {
    return this.appService.updateTask(Number(id), body);
  }

  @Delete(":id")
  deleteTask(@Param("id", ParseIntPipe) id: number) {
    return this.appService.deleteTask(Number(id));
  }
}
