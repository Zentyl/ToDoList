import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AppService } from './app.service';
import { Task } from './task.entity';
import { Account } from './account.entity';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [Task, Account],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task, Account]),

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
