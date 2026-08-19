import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitStatusDto } from './dto/update-visit-status.dto';
import { VisitsService } from './visits.service';

@ApiTags('visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateVisitDto) {
    return this.visits.create(user, dto);
  }

  @Get('my')
  my(@CurrentUser() user: AuthUser) {
    return this.visits.my(user);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Get('agent')
  agent(@CurrentUser() user: AuthUser, @Query() query: QueryPaginationDto) {
    return this.visits.agent(user, query);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateVisitStatusDto,
  ) {
    return this.visits.updateStatus(user, id, dto);
  }
}
