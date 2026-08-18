import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const [users, agents, properties, published, pending, inquiries, visits] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'AGENT' } }),
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: PropertyStatus.PUBLISHED } }),
      this.prisma.property.count({ where: { status: PropertyStatus.PENDING_REVIEW } }),
      this.prisma.inquiry.count(),
      this.prisma.visit.count(),
    ]);
    return { users, agents, properties, published, pending, inquiries, visits };
  }

  users() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateUser(id: string, dto: UpdateAdminUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
  }

  properties() {
    return this.prisma.property.findMany({
      include: {
        agent: { select: { id: true, name: true, email: true } },
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async approve(id: string) {
    await this.requireProperty(id);
    return this.prisma.property.update({
      where: { id },
      data: { status: PropertyStatus.PUBLISHED },
    });
  }

  async reject(id: string) {
    await this.requireProperty(id);
    return this.prisma.property.update({
      where: { id },
      data: { status: PropertyStatus.DRAFT },
    });
  }

  async featured(id: string, featured: boolean) {
    await this.requireProperty(id);
    return this.prisma.property.update({
      where: { id },
      data: { featured },
    });
  }

  private async requireProperty(id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw new NotFoundException({
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }
    return property;
  }
}
