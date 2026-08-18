import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PropertyStatus, Role } from '@prisma/client';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAgentProfileDto } from './dto/update-agent-profile.dto';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.user.findMany({
      where: { role: 'AGENT', isActive: true, agentProfile: { isNot: null } },
      select: {
        id: true,
        name: true,
        avatar: true,
        agentProfile: true,
        _count: { select: { properties: { where: { status: PropertyStatus.PUBLISHED } } } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const agent = await this.prisma.user.findFirst({
      where: { id, role: 'AGENT', isActive: true },
      select: {
        id: true,
        name: true,
        avatar: true,
        email: true,
        phone: true,
        agentProfile: true,
      },
    });
    if (!agent?.agentProfile) {
      throw new NotFoundException({ message: 'Agent not found', code: 'AGENT_NOT_FOUND' });
    }
    return agent;
  }

  async properties(id: string) {
    await this.findOne(id);
    const rows = await this.prisma.property.findMany({
      where: { agentId: id, status: PropertyStatus.PUBLISHED },
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
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((property) => ({
      ...property,
      price: Number(property.price),
      bathrooms: Number(property.bathrooms),
      area: Number(property.area),
      amenities: property.amenities.map((item) => item.amenity),
    }));
  }

  async updateProfile(user: AuthUser, dto: UpdateAgentProfileDto) {
    if (user.role !== Role.AGENT && user.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    return this.prisma.agentProfile.upsert({
      where: { userId: user.id },
      update: dto,
      create: {
        userId: user.id,
        bio: dto.bio,
        agencyName: dto.agencyName,
        licenseNumber: dto.licenseNumber,
        experienceYears: dto.experienceYears ?? 0,
        specialties: dto.specialties ?? [],
      },
    });
  }
}
