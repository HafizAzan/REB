import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyStatus, Role, VisitStatus } from '@prisma/client';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { paginated, paginationOf } from '../common/paginate';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitStatusDto } from './dto/update-visit-status.dto';

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthUser, dto: CreateVisitDto) {
    const scheduledAt = new Date(dto.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() < Date.now()) {
      throw new BadRequestException({
        message: 'Visit time must be in the future',
        code: 'INVALID_VISIT_TIME',
      });
    }

    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
    });
    if (!property || property.status !== PropertyStatus.PUBLISHED) {
      throw new NotFoundException({
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }

    const windowStart = new Date(scheduledAt.getTime() - 60 * 60 * 1000);
    const windowEnd = new Date(scheduledAt.getTime() + 60 * 60 * 1000);
    const conflict = await this.prisma.visit.findFirst({
      where: {
        agentId: property.agentId,
        status: VisitStatus.CONFIRMED,
        scheduledAt: { gte: windowStart, lte: windowEnd },
      },
    });
    if (conflict) {
      throw new BadRequestException({
        message: 'That slot is already booked',
        code: 'VISIT_CONFLICT',
      });
    }

    const visit = await this.prisma.visit.create({
      data: {
        propertyId: property.id,
        userId: user.id,
        agentId: property.agentId,
        scheduledAt,
        notes: dto.notes,
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: property.agentId,
        type: 'VISIT',
        title: 'Visit requested',
        message: `A viewing was requested for ${property.title}`,
      },
    });

    return visit;
  }

  async my(user: AuthUser, query: QueryPaginationDto) {
    const { page, limit, skip, take } = paginationOf(query);
    const where = { userId: user.id };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.visit.count({ where }),
      this.prisma.visit.findMany({
        where,
        include: { property: { select: { id: true, title: true, slug: true, city: true } } },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take,
      }),
    ]);
    return paginated(rows, page, limit, total);
  }

  async agent(user: AuthUser, query: QueryPaginationDto) {
    if (user.role !== Role.AGENT && user.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const { page, limit, skip, take } = paginationOf(query);
    const where = user.role === Role.ADMIN ? {} : { agentId: user.id };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.visit.count({ where }),
      this.prisma.visit.findMany({
        where,
        include: {
          property: { select: { id: true, title: true, slug: true, city: true } },
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take,
      }),
    ]);
    return paginated(rows, page, limit, total);
  }

  async updateStatus(user: AuthUser, id: string, dto: UpdateVisitStatusDto) {
    const visit = await this.prisma.visit.findUnique({ where: { id } });
    if (!visit) {
      throw new NotFoundException({ message: 'Visit not found', code: 'VISIT_NOT_FOUND' });
    }

    const isAgent = user.role === Role.ADMIN || visit.agentId === user.id;
    const isVisitor = visit.userId === user.id;
    if (isVisitor && !isAgent && dto.status !== VisitStatus.CANCELLED) {
      throw new ForbiddenException({
        message: 'You can only cancel your visit',
        code: 'FORBIDDEN',
      });
    }
    if (!isAgent && !isVisitor) {
      throw new ForbiddenException({ message: 'Not allowed', code: 'FORBIDDEN' });
    }

    return this.prisma.visit.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes ?? visit.notes },
    });
  }
}
