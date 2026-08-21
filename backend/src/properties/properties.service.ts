import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  PropertyStatus,
  Role,
} from '@prisma/client';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto, type PropertyMediaDto } from './dto/create-property.dto';
import { QueryPropertiesDto } from './dto/query-properties.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

const listInclude = {
  images: { orderBy: { sortOrder: 'asc' as const } },
  amenities: { include: { amenity: true } },
  agent: {
    select: {
      id: true,
      name: true,
      avatar: true,
      agentProfile: { select: { agencyName: true, experienceYears: true } },
    },
  },
} satisfies Prisma.PropertyInclude;

function isVideoMedia(item: { url: string; kind?: 'IMAGE' | 'VIDEO' }) {
  if (item.kind === 'VIDEO') return true;
  if (item.kind === 'IMAGE') return false;
  return /\/video\/upload\/|\.(mp4|webm|mov)(\?|$)/i.test(item.url);
}

function mediaCreates(
  dto: { media?: PropertyMediaDto[]; imageUrls?: string[]; videoUrls?: string[] },
  altText: string,
) {
  const rows = [
    ...(dto.media ?? []),
    ...(dto.imageUrls ?? []).map((url) => ({ url, kind: 'IMAGE' as const })),
    ...(dto.videoUrls ?? []).map((url) => ({ url, kind: 'VIDEO' as const })),
  ]
    .slice(0, 20)
    .sort((a, b) => Number(isVideoMedia(a)) - Number(isVideoMedia(b)));
  return rows.map((row, index) => ({
    url: row.url,
    publicId: 'publicId' in row ? row.publicId : undefined,
    altText,
    sortOrder: index,
    isPrimary: index === 0 && !isVideoMedia(row),
  }));
}

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: QueryPropertiesDto, user?: AuthUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const sort = ['createdAt', 'price', 'area'].includes(query.sort)
      ? query.sort
      : 'createdAt';
    const order = query.order === 'asc' ? 'asc' : 'desc';

    const where: Prisma.PropertyWhereInput = {};

    const isStaff = user?.role === Role.ADMIN;
    if (!isStaff) {
      if (user?.role === Role.AGENT) {
        where.OR = [{ status: PropertyStatus.PUBLISHED }, { agentId: user.id }];
      } else {
        where.status = PropertyStatus.PUBLISHED;
      }
    }

    if (query.search) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
            { city: { contains: query.search, mode: 'insensitive' } },
            { address: { contains: query.search, mode: 'insensitive' } },
          ],
        },
      ];
    }
    if (query.city) where.city = { equals: query.city, mode: 'insensitive' };
    if (query.propertyType) where.propertyType = query.propertyType;
    if (query.listingType) where.listingType = query.listingType;
    if (query.furnishedStatus) where.furnishedStatus = query.furnishedStatus;
    if (query.constructionStatus) where.constructionStatus = query.constructionStatus;
    if (query.featured !== undefined) where.featured = query.featured;
    if (query.bedrooms !== undefined) where.bedrooms = { gte: query.bedrooms };
    if (query.bathrooms !== undefined) where.bathrooms = { gte: query.bathrooms };
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {
        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
      };
    }
    if (query.minArea !== undefined || query.maxArea !== undefined) {
      where.area = {
        ...(query.minArea !== undefined ? { gte: query.minArea } : {}),
        ...(query.maxArea !== undefined ? { lte: query.maxArea } : {}),
      };
    }
    if (query.amenities) {
      const ids = query.amenities.split(',').filter(Boolean);
      if (ids.length) {
        where.amenities = { some: { amenityId: { in: ids } } };
      }
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        include: listInclude,
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: rows.map((row) => this.serialize(row)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findBySlug(slug: string) {
    const property = await this.prisma.property.findUnique({
      where: { slug },
      include: listInclude,
    });
    if (!property || property.status !== PropertyStatus.PUBLISHED) {
      throw new NotFoundException({
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }

    await this.prisma.propertyView.create({ data: { propertyId: property.id } });
    return this.serialize(property);
  }

  amenities() {
    return this.prisma.amenity.findMany({ orderBy: { name: 'asc' } });
  }

  async findMine(user: AuthUser, query: QueryPaginationDto) {
    this.assertAgent(user);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = user.role === Role.ADMIN ? {} : { agentId: user.id };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        include: listInclude,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return {
      data: rows.map((row) => this.serialize(row)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findMineOne(user: AuthUser, id: string) {
    this.assertAgent(user);
    await this.requireOwned(user, id);
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: listInclude,
    });
    if (!property) {
      throw new NotFoundException({
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }
    return this.serialize(property);
  }

  async create(user: AuthUser, dto: CreatePropertyDto) {
    this.assertAgent(user);
    const { amenityIds, imageUrls, videoUrls, media, ...data } = dto;
    const images = mediaCreates({ media, imageUrls, videoUrls }, dto.title);
    const property = await this.prisma.property.create({
      data: {
        ...data,
        agentId: user.id,
        slug: await this.uniqueSlug(dto.title),
        status: PropertyStatus.DRAFT,
        amenities: amenityIds?.length
          ? { create: amenityIds.map((amenityId) => ({ amenityId })) }
          : undefined,
        images: images.length ? { create: images } : undefined,
      },
      include: listInclude,
    });
    return this.serialize(property);
  }

  async update(user: AuthUser, id: string, dto: UpdatePropertyDto) {
    const existing = await this.requireOwned(user, id);
    const { amenityIds, imageUrls, videoUrls, media, ...data } = dto;
    const images =
      media || imageUrls || videoUrls
        ? mediaCreates({ media, imageUrls, videoUrls }, existing.title)
        : undefined;
    const property = await this.prisma.property.update({
      where: { id: existing.id },
      data: {
        ...data,
        ...(amenityIds
          ? {
              amenities: {
                deleteMany: {},
                create: amenityIds.map((amenityId) => ({ amenityId })),
              },
            }
          : {}),
        ...(images
          ? {
              images: {
                deleteMany: {},
                create: images,
              },
            }
          : {}),
      },
      include: listInclude,
    });
    return this.serialize(property);
  }

  async remove(user: AuthUser, id: string) {
    await this.requireOwned(user, id);
    await this.prisma.property.delete({ where: { id } });
    return { deleted: true };
  }

  async publish(user: AuthUser, id: string) {
    const existing = await this.requireOwned(user, id);
    const nextStatus =
      user.role === Role.ADMIN ? PropertyStatus.PUBLISHED : PropertyStatus.PENDING_REVIEW;
    const property = await this.prisma.property.update({
      where: { id: existing.id },
      data: { status: nextStatus },
      include: listInclude,
    });
    return this.serialize(property);
  }

  async archive(user: AuthUser, id: string) {
    const existing = await this.requireOwned(user, id);
    const property = await this.prisma.property.update({
      where: { id: existing.id },
      data: { status: PropertyStatus.ARCHIVED },
      include: listInclude,
    });
    return this.serialize(property);
  }

  private assertAgent(user: AuthUser) {
    if (user.role !== Role.AGENT && user.role !== Role.ADMIN) {
      throw new ForbiddenException({
        message: 'Only agents can manage listings',
        code: 'FORBIDDEN',
      });
    }
  }

  private async requireOwned(user: AuthUser, id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw new NotFoundException({
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }
    if (user.role !== Role.ADMIN && property.agentId !== user.id) {
      throw new ForbiddenException({
        message: 'You do not own this listing',
        code: 'FORBIDDEN',
      });
    }
    return property;
  }

  private async uniqueSlug(title: string) {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 80);
    let slug = base;
    let i = 1;
    while (await this.prisma.property.findUnique({ where: { slug } })) {
      slug = `${base}-${i++}`;
    }
    return slug;
  }

  private serialize(property: Prisma.PropertyGetPayload<{ include: typeof listInclude }>) {
    return {
      ...property,
      price: Number(property.price),
      bathrooms: Number(property.bathrooms),
      area: Number(property.area),
      amenities: property.amenities.map((item) => item.amenity),
    };
  }
}
