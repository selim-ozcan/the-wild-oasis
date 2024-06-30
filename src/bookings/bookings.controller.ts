import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { StatisticsFilterDateDto } from './dto/statistics-filter-date.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Post('after')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getBookingsAfterDate(@Body() { date }: StatisticsFilterDateDto) {
    return this.bookingsService.getBookingsAfterDate(date);
  }

  @Post('staysAfter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getStaysAfterDate(@Body() { date }: StatisticsFilterDateDto) {
    return this.bookingsService.getStaysAfterDate(date);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll(
    @Query('status') status,
    @Query('sortBy') sortBy,
    @Query('page') page: number,
  ) {
    return this.bookingsService.findAll({ status, sortBy, page });
  }

  @Get('activity')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getStaysTodayActivity() {
    return this.bookingsService.getStaysTodayActivity();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Patch('checkin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  checkin(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.checkin(+id, updateBookingDto);
  }

  @Patch('checkout/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  checkout(@Param('id') id: string) {
    return this.bookingsService.checkout(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
