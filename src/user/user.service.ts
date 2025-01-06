import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { isSameDay } from 'date-fns';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(id: string) {
    return this.prisma.user.create({
      data: {
        wxId: id,
        lastLogin: new Date(),
      },
    });
  }

  async getUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // 减少发送次数
  async reduceSendCount(wxId: string) {
    const user = await this.prisma.user.findUnique({ where: { wxId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 如果最后登录时间是昨天 则重置发送次数
    if (!isSameDay(user.lastLogin, new Date())) {
      await this.updateSendCount(wxId);
    }

    if (user.limit <= 0) {
      return false;
    }

    return this.prisma.user.update({
      where: { wxId },
      data: { limit: { decrement: 1 } },
    });
  }

  // 更新发送次数
  async updateSendCount(wxId: string) {
    return this.prisma.user.update({
      where: { wxId },
      data: { limit: { increment: 10 } },
    });
  }

  //更新最后登录时间
  async updateLastLogin(wxId: string) {
    return this.prisma.user.update({
      where: { wxId },
      data: { lastLogin: new Date() },
    });
  }
}
