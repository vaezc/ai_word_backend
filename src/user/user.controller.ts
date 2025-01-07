import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: { id: string }) {
    if (!body.id) {
      throw new BadRequestException('id is required');
    }

    const user = await this.userService.getUser(body.id);
    if (user) {
      return await this.userService.updateLastLogin(body.id);
    } else {
      return await this.userService.createUser(body.id);
    }
  }
}
