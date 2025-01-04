import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly redisService: RedisService) {}

  async updateCount(id: string) {
    const count = Number(await this.redisService.get('users+' + id));

    if (count) {
      this.redisService.set('users+' + id, count + 1);
    } else {
      this.redisService.set('users+' + id, 1);
    }
    return {
      count: count,
    };
  }

  create(createUserDto: CreateUserDto) {
    this.redisService.set('users+' + createUserDto.id, 0);
    return createUserDto;
  }

  findOne(id: string) {
    return this.redisService.get('users+' + id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const count = await this.redisService.get('users+' + id);
    if (count) {
      this.redisService.set('users+' + id, count + 1);
    } else {
      this.redisService.set('users+' + id, 1);
    }

    return updateUserDto;
  }

  remove(id: number) {
    this.redisService.del('users+ ' + id);
    return `This action removes a #${id} user`;
  }
}
