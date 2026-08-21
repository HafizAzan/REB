import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { QueryPaginationDto } from '../common/dto/query-pagination.dto';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: QueryPaginationDto) {
    return this.favorites.list(user, query);
  }

  @Get('check/:propertyId')
  check(@CurrentUser() user: AuthUser, @Param('propertyId') propertyId: string) {
    return this.favorites.check(user, propertyId);
  }

  @Post(':propertyId')
  add(@CurrentUser() user: AuthUser, @Param('propertyId') propertyId: string) {
    return this.favorites.add(user, propertyId);
  }

  @Delete(':propertyId')
  remove(@CurrentUser() user: AuthUser, @Param('propertyId') propertyId: string) {
    return this.favorites.remove(user, propertyId);
  }
}
