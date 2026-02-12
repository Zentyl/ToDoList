import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: number;
  };
}

@Controller("tasks/")
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getTasks(@Request() req: RequestWithUser) {
    return this.taskService.getAllTasks(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createTask(
    @Body("text") text: string,
    @Body("priority") priority: number,
    @Body("date") date: Date,
    @Request() req: RequestWithUser
  ) {
    const userId = req.user.userId;
    return this.taskService.createTask(text, date, priority, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(":id")
  updateTask(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Request() req: RequestWithUser) {
    return this.taskService.updateTask(Number(id), body, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(":id")
  deleteTask(@Param("id", ParseIntPipe) id: number, @Request() req: RequestWithUser) {
    return this.taskService.deleteTask(Number(id), req.user.userId);
  }
}
