import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestsRepository: Repository<Guest>,
  ) {}

  async create(createGuestDto: CreateGuestDto) {
    const newGuest = {
      ...createGuestDto,
      createdAt: new Date(),
    };

    const createdGuest = await this.guestsRepository.save(newGuest);

    return createdGuest;
  }

  findAll() {
    return this.guestsRepository.find();
  }

  findOne(id: number) {
    return this.guestsRepository.findOneBy({ id });
  }

  async update(id: number, updateGuestDto: UpdateGuestDto) {
    const existingGuest = await this.guestsRepository.findOneBy({ id });

    if (!existingGuest)
      throw new BadRequestException('Guest with the given id does not exist');

    existingGuest.countryFlag =
      updateGuestDto.countryFlag ?? existingGuest.countryFlag;
    existingGuest.email = updateGuestDto.email ?? existingGuest.email;
    existingGuest.fullName = updateGuestDto.fullName ?? existingGuest.fullName;
    existingGuest.nationalId =
      updateGuestDto.nationalId ?? existingGuest.nationalId;
    existingGuest.nationality =
      updateGuestDto.nationality ?? existingGuest.nationality;

    const updatedGuest = await this.guestsRepository.save(existingGuest);

    return updatedGuest;
  }

  remove(id: number) {
    return this.guestsRepository.delete(id);
  }
}
