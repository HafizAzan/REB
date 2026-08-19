import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { QueryPropertiesDto } from './dto/query-properties.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly properties: PropertiesService) {}

  @Public()
  @Get()
  findMany(@Query() query: QueryPropertiesDto) {
    return this.properties.findMany(query);
  }

  @Public()
  @Get('meta/amenities')
  amenities() {
    return this.properties.amenities();
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Get('mine')
  findMine(@CurrentUser() user: AuthUser, @Query() query: QueryPaginationDto) {
    return this.properties.findMine(user, query);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Get('mine/:id')
  findMineOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.properties.findMineOne(user, id);
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.properties.findBySlug(slug);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePropertyDto) {
    return this.properties.create(user, dto);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.properties.update(user, id, dto);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.properties.remove(user, id);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Post(':id/publish')
  publish(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.properties.publish(user, id);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Post(':id/archive')
  archive(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.properties.archive(user, id);
  }
}
