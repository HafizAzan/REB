import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';
import { InquiriesService } from './inquiries.service';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateInquiryDto) {
    return this.inquiries.create(user, dto);
  }

  @Get('my')
  my(@CurrentUser() user: AuthUser, @Query() query: QueryPaginationDto) {
    return this.inquiries.my(user, query);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Get('agent')
  agent(@CurrentUser() user: AuthUser, @Query() query: QueryPaginationDto) {
    return this.inquiries.agent(user, query);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateInquiryStatusDto,
  ) {
    return this.inquiries.updateStatus(user, id, dto);
  }
}
