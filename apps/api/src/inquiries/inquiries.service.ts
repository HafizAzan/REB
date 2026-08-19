import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyStatus, Role } from '@prisma/client';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthUser, dto: CreateInquiryDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
    });
    if (!property || property.status !== PropertyStatus.PUBLISHED) {
      throw new NotFoundException({
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }

    const inquiry = await this.prisma.inquiry.create({
      data: {
        propertyId: property.id,
        userId: user.id,
        agentId: property.agentId,
        name: dto.name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        preferredVisitDate: dto.preferredVisitDate ? new Date(dto.preferredVisitDate) : null,
        message: dto.message,
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: property.agentId,
        type: 'INQUIRY',
        title: 'New inquiry',
        message: `${dto.name} asked about ${property.title}`,
      },
    });

    return inquiry;
  }

  my(user: AuthUser) {
    return this.prisma.inquiry.findMany({
      where: { userId: user.id },
      include: { property: { select: { id: true, title: true, slug: true, city: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async agent(user: AuthUser, query: QueryPaginationDto) {
    if (user.role !== Role.AGENT && user.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = user.role === Role.ADMIN ? {} : { agentId: user.id };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.inquiry.count({ where }),
      this.prisma.inquiry.findMany({
        where,
        include: {
          property: { select: { id: true, title: true, slug: true, city: true } },
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

  async updateStatus(user: AuthUser, id: string, dto: UpdateInquiryStatusDto) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException({ message: 'Inquiry not found', code: 'INQUIRY_NOT_FOUND' });
    }
    if (user.role !== Role.ADMIN && inquiry.agentId !== user.id) {
      throw new ForbiddenException({ message: 'You do not own this inquiry', code: 'FORBIDDEN' });
    }
    return this.prisma.inquiry.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
