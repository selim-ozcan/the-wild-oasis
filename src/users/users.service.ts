import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const encryptedPassword = await this.hashPassword(createUserDto.password);

    let existingUser;
    try {
      existingUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (error) {}

    if (existingUser)
      throw new BadRequestException(
        'An account with given email already exists',
      );

    return this.usersRepository.save({
      ...createUserDto,
      password: encryptedPassword,
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const encryptedPassword =
      updateUserDto.password &&
      (await this.hashPassword(updateUserDto.password));

    return this.usersRepository.update(id, {
      ...updateUserDto,
      password: encryptedPassword,
    });
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    let passwordIsValid;
    try {
      passwordIsValid = await bcrypt.compare(password, user.password);
    } catch (error) {
      this.logger.warn('Error occured on local auth strategy bcrypt compare');
      throw new UnauthorizedException('Credentials are not valid.');
    }

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }
}
