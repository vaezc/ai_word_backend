// redis.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS') private readonly client: Redis) {}

  // 查询
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  // 插入 expiration为过期时间，可选
  async set(key: string, value: any, expiration?: number): Promise<void> {
    if (expiration) {
      await this.client.set(key, value, 'EX', expiration);
    } else {
      await this.client.set(key, value);
    }
  }

  // 删除
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // ... 其他方法
}
