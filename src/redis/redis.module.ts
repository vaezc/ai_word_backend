// redis.module.ts
import { Global, Module } from '@nestjs/common';

import { Redis } from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: async () => {
        const client = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD,
          retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          reconnectOnError(err) {
            const targetError = 'READONLY';
            if (err.message.includes(targetError)) {
              return true;
            }
            return false;
          },
        });

        client.on('error', (err) => {
          console.error('Redis 连接错误:', err);
        });

        client.on('connect', () => {
          console.log('Redis 连接成功');
        });

        return client;
      },
    },
    RedisService,
  ],
  exports: ['REDIS', RedisService],
})
export class RedisModule {}
