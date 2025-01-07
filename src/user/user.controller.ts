import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
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
      const user = await this.userService.getUser(data.openid);
      if (user) {
        await this.userService.updateLastLogin(data.openid, data.session_key);
      } else {
        await this.userService.createUser(data.openid, data.session_key);
      }
      return {
        code: 0,
        message: 'success',
        data: {
          openid: data.openid,
        },
      };
    } else {
      throw new BadRequestException('login failed');
    }
  }
}
