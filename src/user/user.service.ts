import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existUser) {
      throw new BadRequestException(`Пользователь с таким email уже зарегистрирован`);
    }

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });
    return { user };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }
}
