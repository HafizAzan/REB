import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { UpdateFeaturedDto } from './dto/update-featured.dto';

@ApiTags('admin')
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.stats();
  }

  @Get('users')
  users(@Query() query: QueryPaginationDto) {
    return this.admin.users(query);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.admin.updateUser(id, dto);
  }

  @Get('properties')
  properties(@Query() query: QueryPaginationDto) {
    return this.admin.properties(query);
  }

  @Post('properties/:id/approve')
  approve(@Param('id') id: string) {
    return this.admin.approve(id);
  }

  @Post('properties/:id/reject')
  reject(@Param('id') id: string) {
    return this.admin.reject(id);
  }

  @Patch('properties/:id/featured')
  featured(@Param('id') id: string, @Body() body: UpdateFeaturedDto) {
    return this.admin.featured(id, body.featured);
  }
}
