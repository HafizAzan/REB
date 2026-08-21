import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { AgentsService } from './agents.service';
import { UpdateAgentProfileDto } from './dto/update-agent-profile.dto';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agents: AgentsService) {}

  @Public()
  @Get()
  findMany(@Query() query: QueryPaginationDto) {
    return this.agents.findMany(query);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Patch('profile')
  updateProfile(@CurrentUser() user: AuthUser, @Body() dto: UpdateAgentProfileDto) {
    return this.agents.updateProfile(user, dto);
  }

  @Public()
  @Get(':id/properties')
  properties(@Param('id') id: string) {
    return this.agents.properties(id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agents.findOne(id);
  }
}
