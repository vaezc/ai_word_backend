import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: { id: string }) {
    if (!body.id) {
      throw new BadRequestException('id is required');
    }

    // 换取openid
    const res = await fetch(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.app_id}&secret=${process.env.app_secret}&js_code=${body.id}&grant_type=authorization_code`,
    );
    const data = await res.json();
    if (data.errcode) {
      throw new BadRequestException(data.errmsg);
    }

    if (data.openid) {
      const token = await this.authService.signIn(
        data.openid,
        data.session_key,
      );

      return {
        code: 0,
        message: 'success',
        data: token,
      };
    } else {
      throw new BadRequestException('login failed');
    }
  }
}
