import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller()
export class AuthController {
    constructor(private readonly appService: AppService) { }

    @Post('register')
    createAccount(
        @Body('login') login: string,
        @Body('password') password: string,
        @Body('email') email: string,
    ) {
        return this.appService.createAccount(login, password, email);
    }

    @Post('login')
    login(
        @Body('login') login: string,
        @Body('password') password: string
    ) {
        return this.appService.login(login, password);
    }
}
