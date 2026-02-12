import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('tasks')
  getTasks() {
    return this.appService.getAllTasks();
  }

  @Post('tasks')
  createTask(
    @Body("text") text: string,
    @Body("priority") priority: number,
    @Body("date") date: Date
  ) {
    return this.appService.createTask(text, date, priority);
  }

  @Patch("tasks/:id")
  updateTask(@Param("id", ParseIntPipe) id: number, @Body() body: any) {
    return this.appService.updateTask(Number(id), body);
  }

  @Delete("tasks/:id")
  deleteTask(@Param("id", ParseIntPipe) id: number) {
    return this.appService.deleteTask(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  async getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.appService.updateUser(+id, body);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(+id);
  }
}
