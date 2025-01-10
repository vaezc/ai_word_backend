import { Controller, Get, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getMessage(@Query('id') id: string) {
    try {
      const message = await this.messageService.getMessage(id);
      return {
        code: 200,
        message: '获取成功',
        data: message,
      };
    } catch (error) {
      return {
        code: 500,
        message: '获取失败',
      };
    }
  }
}
