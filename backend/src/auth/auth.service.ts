
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async register(login: string, passwordPlain: string, email: string): Promise<User> {
        const existingUser = await this.userService.findOneByLoginOrEmail(login, email);

        if (existingUser) {
            throw new ConflictException('Użytkownik o takim loginie lub e-mailu już istnieje!');
        }

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(passwordPlain, saltRounds);

        return this.userService.createUser({
            login,
            password: hashedPassword,
            email
        });
    }

    async login(login: string, passwordPlain: string) {
        const user = await this.userService.findOneByLogin(login);

        if (!user || !(await bcrypt.compare(passwordPlain, user.password))) {
            throw new UnauthorizedException('Nieprawidłowy login lub hasło!');
        }

        const payload = { sub: user.id, username: user.login };

        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}