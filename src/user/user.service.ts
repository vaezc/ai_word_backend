import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { isSameDay } from 'date-fns';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(id: string, sessionKey: string) {
    return this.prisma.user.create({
      data: {
        wxId: id,
        lastLogin: new Date(),
        sessionKey,
      },
    });
  }

  async getUser(wxId: string) {
    return this.prisma.user.findUnique({ where: { wxId } });
  }

  // 减少发送次数
  async reduceSendCount(wxId: string) {
    const user = await this.prisma.user.findUnique({ where: { wxId } });
    if (!user) {
      throw new NotFoundException('User not found');
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
    await this.updateLastLogin(wxId);
    return this.prisma.user.update({
      where: { wxId },
      data: { limit: { increment: 10 } },
    });
  }

  //更新最后登录时间
  async updateLastLogin(wxId: string) {
    const user = await this.prisma.user.findUnique({ where: { wxId } });
    // 如果最后登录时间是昨天 则重置发送次数

    if (!isSameDay(user.lastLogin, new Date())) {
      await this.updateSendCount(wxId);
    }

    return this.prisma.user.update({
      where: { wxId },
      data: { lastLogin: new Date() },
    });
  }
}
