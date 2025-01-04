import { Module } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RedisModule } from 'src/redis/redis.module';
@Module({
  controllers: [UsersController],
  providers: [UsersService, RedisService],
  imports: [RedisModule],
})
export class UsersModule {}
