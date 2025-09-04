import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { FilterClienteDto } from './dto/filterCliente.dto';

@Injectable()
export class ClientesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAllPagination(query?: FilterClienteDto) {

        const { page = 1, limit = 10, name, email, tenantId } = query || {};
        const where: Prisma.clienteWhereInput = {};

        if (name) {
            where.name = { contains: name, mode: 'insensitive' };
        }

        if (email) {
            where.email = { contains: email, mode: 'insensitive' };
        }

        if (tenantId) {
            where.tenantId = tenantId;
        }

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const [clientes, total] = await this.prisma.$transaction([
            this.prisma.cliente.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.cliente.count({ where }),
        ]);
        return {
            data: clientes,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }

    async findOne(id: string, tenantId: string | undefined = undefined) {
        return this.prisma.cliente.findUnique({ where: { id, tenantId } });
    }

    async create(createClienteDto: CreateClienteDto, file: Express.Multer.File) {

        if (file) {
            createClienteDto.imageUrl = `/clientes/${file.filename}`;
        }

        const result = await this.prisma.cliente.create({
            data: {
                tenantId: createClienteDto.tenantId,
                name: createClienteDto.name,
                email: createClienteDto.email,
                isActive: createClienteDto.isActive,
                contact: createClienteDto.contact,
                address: {
                    zip_code: createClienteDto.zip_code,
                    street: createClienteDto.street,
                    neighborhood: createClienteDto.neighborhood,
                    number: createClienteDto.number,
                    state: createClienteDto.state,
                    city: createClienteDto.city,
                    complement: createClienteDto.complement,
                },
                imageUrl: createClienteDto.imageUrl,
            },
        });
        return result;
    }

    async update(id: string, updateClienteDto: UpdateClienteDto, file: Express.Multer.File) {
        if (file) {
            updateClienteDto.imageUrl = `/clientes/${file.filename}`;
        }

        const result = await this.prisma.cliente.update({
            where: { id },
            data: {
                tenantId: updateClienteDto.tenantId,
                name: updateClienteDto.name,
                email: updateClienteDto.email,
                isActive: updateClienteDto.isActive,
                contact: updateClienteDto.contact,
                address: {
                    zip_code: updateClienteDto.zip_code,
                    street: updateClienteDto.street,
                    neighborhood: updateClienteDto.neighborhood,
                    number: updateClienteDto.number,
                    state: updateClienteDto.state,
                    city: updateClienteDto.city,
                    complement: updateClienteDto.complement,
                },
                imageUrl: updateClienteDto.imageUrl,
            },
        });
        return result;
    }

    async remove(id: string, tenantId: string) {
        return this.prisma.cliente.update({
            where: { id, tenantId },
            data: { isActive: false }
        });
    }
}
