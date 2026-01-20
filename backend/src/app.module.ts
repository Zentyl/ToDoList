import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Task } from './task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [Task],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
