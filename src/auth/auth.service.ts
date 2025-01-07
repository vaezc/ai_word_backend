import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(wxId: string, sessionKey: string): Promise<any> {
    let user = await this.usersService.getUser(wxId);
    if (!user) {
      // throw new UnauthorizedException();
      user = await this.usersService.createUser(wxId, sessionKey);
    }
    const payload = { sessionKey: user.sessionKey, wxId: user.wxId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
