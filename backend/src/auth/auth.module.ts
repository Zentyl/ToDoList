import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: 'tajne_haslo',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        JwtStrategy,
        AuthService,
    ],
})
export class AuthModule { }
