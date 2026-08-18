import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PropertyStatus } from '@prisma/client';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(user: AuthUser, propertyId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.status !== PropertyStatus.PUBLISHED) {
      throw new NotFoundException({
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }
    try {
      return await this.prisma.favorite.create({
        data: { userId: user.id, propertyId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({
          message: 'Already saved',
          code: 'ALREADY_FAVORITED',
        });
      }
      throw error;
    }
  }

  async remove(user: AuthUser, propertyId: string) {
    await this.prisma.favorite.deleteMany({
      where: { userId: user.id, propertyId },
    });
    return { removed: true };
  }

  async list(user: AuthUser) {
    const rows = await this.prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        property: {
          include: {
            images: { orderBy: { sortOrder: 'asc' } },
            amenities: { include: { amenity: true } },
            agent: {
              select: {
                id: true,
                name: true,
                avatar: true,
                agentProfile: { select: { agencyName: true, experienceYears: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ({
      ...row.property,
      price: Number(row.property.price),
      bathrooms: Number(row.property.bathrooms),
      area: Number(row.property.area),
      amenities: row.property.amenities.map((item) => item.amenity),
    }));
  }

  async check(user: AuthUser, propertyId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId: user.id, propertyId } },
    });
    return { saved: Boolean(favorite) };
  }
}
