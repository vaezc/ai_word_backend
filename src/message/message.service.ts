import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessage(id: string) {
    return this.prisma.wordHistory.findUnique({ where: { id } });
  }
}
