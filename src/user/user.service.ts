import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existUser) {
      throw new BadRequestException(`Пользователь с таким email уже зарегистрирован`);
    }

    return this.userRepository.create(createUserDto);
  }

  findOne() {
    return `This action returns all user`;
  }
}
