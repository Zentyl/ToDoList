import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { Task } from './task/task.entity';
import { User } from './user/user.entity';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [Task, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task, User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
      global: true,
      secret: 'tajne_haslo',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    TaskController,
    UserController,
  ],
  providers: [
    AppService,
    JwtStrategy,
    AuthService,
    UserService,
    TaskService,
  ],
})
export class AppModule { }
