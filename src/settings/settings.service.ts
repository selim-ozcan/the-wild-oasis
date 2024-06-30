import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepository: Repository<Setting>,
  ) {}

  create(createSettingDto: CreateSettingDto) {
    const newSetting = {
      ...createSettingDto,
      createdAt: new Date(),
    };

    return this.settingsRepository.save(newSetting);
  }

  findAll() {
    return this.settingsRepository.find();
  }

  findOne(id: number) {
    return this.settingsRepository.findOneBy({ id });
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    const existingSetting = await this.settingsRepository.findOneBy({ id });

    if (!existingSetting)
      throw new BadRequestException('Guest with the given id does not exist');

    existingSetting.maxBookingLength =
      updateSettingDto.maxBookingLength ?? existingSetting.maxBookingLength;
    existingSetting.maxGuestsPerBooking =
      updateSettingDto.maxGuestsPerBooking ??
      existingSetting.maxGuestsPerBooking;
    existingSetting.minBookingLength =
      updateSettingDto.minBookingLength ?? existingSetting.minBookingLength;
    existingSetting.breakfastPrice =
      updateSettingDto.breakfastPrice ?? existingSetting.breakfastPrice;

    const updatedSetting = await this.settingsRepository.save(existingSetting);

    return updatedSetting;
  }

  remove(id: number) {
    return this.settingsRepository.delete(id);
  }
}
