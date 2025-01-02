import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [],
})
export class ChatModule {}
