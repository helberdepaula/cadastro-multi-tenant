import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { FilterUserDto } from './dto/filterUser.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ForbiddenException('Email já está em uso');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        tenantId: createUserDto.tenantId,
        name: createUserDto.name,
        email: createUserDto.email,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
  }

  async findAll(query: FilterUserDto) {
    const where: Prisma.UserWhereInput = {};

    if (query.name) {
      where.name = {
        contains: query.name,
        mode: 'insensitive'
      };
    }

    if (query.email) {
      where.email = {
        contains: query.email,
        mode: 'insensitive'
      };
    }

    if (query.role) {
      where.role = query.role;
    }

    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, tenantId: string | undefined = undefined) {
    const user = await this.prisma.user.findUnique({
      where: { id, tenantId }
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o email novo já existe
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ForbiddenException('Email já está em uso');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string, tenantId: string) {
    const user = await this.prisma.user.findUnique({ where: { id, tenantId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.prisma.user.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
  }


}
