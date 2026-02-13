
import { Injectable, ConflictException, UnauthorizedException, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async onApplicationBootstrap() {
        const adminExists = await this.userService.findOneByLogin('admin');

        if (!adminExists) {
            console.log('Nie znaleziono konta administratora. Tworzenie domyślnego konta...');

            await this.register('admin', '123', 'admin@todomenalist.pl', 'admin');

            console.log('Pomyślnie utworzono domyślne konto administratora (Login: admin, Hasło: 123).');
        }
    }

    async register(login: string, passwordPlain: string, email: string, role: string = 'user'): Promise<User> {
        const existingUser = await this.userService.findOneByLoginOrEmail(login, email);

        if (existingUser) {
            throw new ConflictException('Użytkownik o takim loginie lub e-mailu już istnieje!');
        }

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(passwordPlain, saltRounds);

        return this.userService.createUser({
            login,
            password: hashedPassword,
            email,
            role
        });
    }

    async login(login: string, passwordPlain: string) {
        const user = await this.userService.findOneByLogin(login);

        if (!user || !(await bcrypt.compare(passwordPlain, user.password))) {
            throw new UnauthorizedException('Nieprawidłowy login lub hasło!');
        }

        const payload = {
            sub: user.id,
            username: user.login,
            role: user.role
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}