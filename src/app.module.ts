import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ChatModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
