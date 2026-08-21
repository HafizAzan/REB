import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const [
      users,
      agents,
      properties,
      published,
      pending,
      featured,
      suspended,
      inquiries,
      visits,
      listingsByStatus,
      usersByRole,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'AGENT' } }),
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: PropertyStatus.PUBLISHED } }),
      this.prisma.property.count({ where: { status: PropertyStatus.PENDING_REVIEW } }),
      this.prisma.property.count({ where: { featured: true } }),
      this.prisma.user.count({ where: { isActive: false } }),
      this.prisma.inquiry.count(),
      this.prisma.visit.count(),
      this.prisma.property.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    ]);

    return {
      users,
      agents,
      properties,
      published,
      pending,
      featured,
      suspended,
      inquiries,
      visits,
      listingsByStatus: Object.fromEntries(
        listingsByStatus.map((row) => [row.status, row._count._all]),
      ),
      usersByRole: Object.fromEntries(usersByRole.map((row) => [row.role, row._count._all])),
    };
  }

  async users(query: QueryPaginationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  updateUser(id: string, dto: UpdateAdminUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
  }

  async properties(query: QueryPaginationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.property.count(),
      this.prisma.property.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          featured: true,
          city: true,
          price: true,
          listingType: true,
          agent: { select: { id: true, name: true, email: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: rows.map((row) => ({ ...row, price: Number(row.price) })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
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
