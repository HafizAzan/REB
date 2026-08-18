import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.favorites.list(user);
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
