import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCabinDto } from './dto/create-cabin.dto';
import { UpdateCabinDto } from './dto/update-cabin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cabin } from './entities/cabin.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/common/s3/s3.service';
import {
  CABINS_BUCKET,
  CABINS_IMAGE_FILE_EXTENSION,
} from './constants/cabin.constants';

@Injectable()
export class CabinsService {
  constructor(
    @InjectRepository(Cabin)
    private readonly cabinsRepository: Repository<Cabin>,
    private readonly s3Service: S3Service,
  ) {}

  async create(createCabinDto: CreateCabinDto, image: Express.Multer.File) {
    const newCabin = {
      ...createCabinDto,
      createdAt: new Date(),
    };

    let createdCabin = (await this.cabinsRepository.save(newCabin)) as Cabin;

    if (createCabinDto.image) {
      createdCabin.image = createCabinDto.image;
    } else {
      try {
        await this.s3Service.upload({
          bucket: CABINS_BUCKET,
          key: `${createdCabin.id}.${CABINS_IMAGE_FILE_EXTENSION}`,
          file: image.buffer,
        });

        createdCabin.image = this.s3Service.getObjectUrl(
          CABINS_BUCKET,
          `${createdCabin.id}.jpg`,
        );

        createdCabin = await this.cabinsRepository.save(createdCabin);
      } catch (error) {
        this.cabinsRepository.delete(createdCabin.id);
        throw error;
      }
    }

    return createdCabin;
  }

  findAll() {
    return this.cabinsRepository.find();
  }

  findOne(id: number) {
    return this.cabinsRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateCabinDto: UpdateCabinDto,
    image: Express.Multer.File,
  ) {
    const existingCabin = await this.cabinsRepository.findOneBy({ id });

    if (!existingCabin)
      throw new BadRequestException('Cabin with the given id does not exist');

    if (image) {
      try {
        await this.s3Service.upload({
          bucket: CABINS_BUCKET,
          key: `${id}.${CABINS_IMAGE_FILE_EXTENSION}`,
          file: image.buffer,
        });

        existingCabin.image = this.s3Service.getObjectUrl(
          CABINS_BUCKET,
          `${id}.jpg`,
        );
      } catch (error) {
        throw error;
      }
    }

    existingCabin.name = updateCabinDto.name ?? existingCabin.name;
    existingCabin.maxCapacity =
      updateCabinDto.maxCapacity ?? existingCabin.maxCapacity;
    existingCabin.regularPrice =
      updateCabinDto.regularPrice ?? existingCabin.regularPrice;
    existingCabin.discount = updateCabinDto.discount ?? existingCabin.discount;
    existingCabin.description =
      updateCabinDto.description ?? existingCabin.description;

    const updatedCabin = await this.cabinsRepository.save(existingCabin);

    return updatedCabin;
  }

  remove(id: number) {
    return this.cabinsRepository.delete(id);
  }
}
