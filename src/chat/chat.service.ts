import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async addMessage(
    id: string,
    message: string,
    scene: string,
    topic: string,
    tips: string,
    interest: string,
  ) {
    return this.prisma.wordHistory.create({
      data: {
        userId: id,
        word: message,
        scene,
        topic,
        tips,
        interest,
      },
    });
  }
}
