import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyStatus, Role } from '@prisma/client';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { paginated, paginationOf } from '../common/paginate';
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

  async my(user: AuthUser, query: QueryPaginationDto) {
    const { page, limit, skip, take } = paginationOf(query);
    const where = { userId: user.id };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.inquiry.count({ where }),
      this.prisma.inquiry.findMany({
        where,
        include: { property: { select: { id: true, title: true, slug: true, city: true } } },
        orderBy: { createdAt: 'desc' },
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
      this.prisma.inquiry.count({ where }),
      this.prisma.inquiry.findMany({
        where,
        include: {
          property: { select: { id: true, title: true, slug: true, city: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);
    return paginated(rows, page, limit, total);
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
