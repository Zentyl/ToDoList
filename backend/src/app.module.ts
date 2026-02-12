import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AppService } from './app.service';
import { Task } from './task.entity';
import { User } from './user.entity';
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
    AuthController
  ],
  providers: [
    AppService,
    JwtStrategy
  ],
})
export class AppModule { }
