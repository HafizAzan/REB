import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
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
  my(@CurrentUser() user: AuthUser) {
    return this.inquiries.my(user);
  }

  @Roles(Role.AGENT, Role.ADMIN)
  @Get('agent')
  agent(@CurrentUser() user: AuthUser) {
    return this.inquiries.agent(user);
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
