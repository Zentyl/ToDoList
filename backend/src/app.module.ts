import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
import { AppService } from './app.service';
import { Task } from './task.entity';
import { Account } from './account.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [Task, Account],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task, Account]),

  JwtModule.register({
      global: true,
      secret: 'tajne_haslo',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AppController,
    AuthController
  ],
  providers: [AppService],
})
export class AppModule { }
