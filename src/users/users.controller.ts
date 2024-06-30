import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PasswordTransformInterceptor } from './interceptors/password-transform.interceptor';
import { TokenPayload } from 'src/auth/token-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(PasswordTransformInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(PasswordTransformInterceptor)
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: TokenPayload) {
    return user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(PasswordTransformInterceptor)
  @Roles(Role.Admin)
  findOne(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    if (user.role === Role.Admin || user.id === id) {
      return this.usersService.findOne(+id);
    } else
      throw new ForbiddenException('You are not authorized to view this user.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(PasswordTransformInterceptor)
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (user.id === id) {
      return this.usersService.update(+id, updateUserDto);
    } else
      throw new ForbiddenException(
        'You are not authorized to update this user.',
      );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(PasswordTransformInterceptor)
  @Roles(Role.Admin)
  remove(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    if (user.role === Role.Admin || user.id === id) {
      return this.usersService.remove(+id);
    } else
      throw new ForbiddenException(
        'You are not authorized to delete this user.',
      );
  }
}
