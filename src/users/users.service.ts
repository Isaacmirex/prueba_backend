// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashed = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: hashed,
        role: createUserDto.role ?? 'USER',
      },
      select: { id: true, username: true, role: true, createdAt: true, updatedAt: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, role: true, createdAt: true, updatedAt: true },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, role: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: { id: true, username: true, role: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async remove(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
      select: { id: true, username: true, role: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }
}
