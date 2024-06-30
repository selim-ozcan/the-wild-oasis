import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import {
  And,
  Equal,
  LessThanOrEqual,
  MoreThanOrEqual,
  Or,
  Repository,
} from 'typeorm';
import getToday from '../utils/getToday';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
  ) {}

  create(createBookingDto: CreateBookingDto) {
    return this.bookingsRepository.create(createBookingDto);
  }

  findAll({ status, sortBy, page }) {
    const query: any = { relations: { guest: true, cabin: true } };
    if (status) query.where = { status };
    if (sortBy) {
      const [sortByProperty, sortByDirection] = sortBy.split('-');
      query.order = {
        [sortByProperty]: sortByDirection,
      };
    } else {
      query.order = {
        createdAt: 'desc',
      };
    }
    if (page) {
      query.skip = (page - 1) * 7;
      query.take = 7;
    }

    return this.bookingsRepository.findAndCount(query);
  }

  findOne(id: number) {
    return this.bookingsRepository.findOne({
      where: { id },
      relations: { guest: true, cabin: true },
    });
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return this.bookingsRepository.update(id, updateBookingDto);
  }

  checkin(id: number, updateBookingDto: UpdateBookingDto) {
    return this.bookingsRepository.update(id, {
      isPaid: true,
      status: 'checked-in',
      ...updateBookingDto,
    });
  }

  checkout(id: number) {
    return this.bookingsRepository.update(id, {
      status: 'checked-out',
    });
  }

  remove(id: number) {
    return this.bookingsRepository.delete(id);
  }

  getBookingsAfterDate(date: Date) {
    return this.bookingsRepository.find({
      where: {
        createdAt: And(
          MoreThanOrEqual(date),
          LessThanOrEqual(getToday({ end: true })),
        ),
      },
      order: { createdAt: 'desc' },
    });
  }

  getStaysAfterDate(date: Date) {
    return this.bookingsRepository.find({
      where: {
        startDate: And(
          MoreThanOrEqual(date),
          LessThanOrEqual(getToday({ end: true })),
        ),
        status: Or(Equal('checked-in'), Equal('checked-out')),
      },
      order: { startDate: 'desc' },
    });
  }

  async getStaysTodayActivity() {
    // typeorm  calls toISOString on Date objects while serializing.
    return this.bookingsRepository.find({
      relations: {
        guest: true,
      },
      where: [
        { startDate: getToday(), status: 'unconfirmed' },
        { endDate: getToday(), status: 'checked-in' },
      ],
    });
  }
}
