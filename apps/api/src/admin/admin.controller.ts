import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
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
  users() {
    return this.admin.users();
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.admin.updateUser(id, dto);
  }

  @Get('properties')
  properties() {
    return this.admin.properties();
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
