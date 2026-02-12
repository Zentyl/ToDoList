import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(
        @Body('login') login: string,
        @Body('password') password: string,
        @Body('email') email: string,
    ) {
        return this.authService.register(login, password, email);
    }

    @Post('login')
    login(
        @Body('login') login: string,
        @Body('password') password: string
    ) {
        return this.authService.login(login, password);
    }
}
