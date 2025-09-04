import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { createPermissionsGuard } from './permissions.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilterClienteDto } from './dto/filterCliente.dto';
import type { IResponseJwt } from 'src/auth/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('clientes')
@Controller('clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) { }

    @Get()
    @UseGuards(createPermissionsGuard('READ'))
    @ApiOperation({ summary: 'Listar todos os clientes' })
    @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso' })
    async findAll(@Query() query: FilterClienteDto, @Request() request: IResponseJwt) {
        query.tenantId = request.user.tenantId;
        return await this.clientesService.findAllPagination(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar cliente por ID' })
    @ApiParam({ name: 'id', description: 'ID do cliente' })
    @ApiResponse({ status: 200, description: 'Cliente encontrado com sucesso' })
    @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
    async findOne(@Param('id') id: string, @Request() request: IResponseJwt) {
        const tenantId = request.user.tenantId;
        return await this.clientesService.findOne(id, tenantId);
    }

    @Post()
    @UseGuards(createPermissionsGuard('READ'))
    @ApiConsumes('multipart/form-data')
    @UseGuards(createPermissionsGuard('CREATE'))
    @ApiOperation({ summary: 'Criar novo cliente' })
    @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
    @UseInterceptors(FileInterceptor('imageUrl'))
    async create(@Body() body: CreateClienteDto, @UploadedFile() imageUrl: Express.Multer.File, @Request() request: IResponseJwt) {
        body.tenantId = request.user.tenantId;
        return await this.clientesService.create(body, imageUrl);
    }

    @Put(':id')
    @UseGuards(createPermissionsGuard('UPDATE'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Atualizar cliente' })
    @ApiParam({ name: 'id', description: 'ID do cliente' })
    @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso' })
    @UseInterceptors(FileInterceptor('imageUrl'))
    async update(@Param('id') id: string, @Body() body: UpdateClienteDto, @UploadedFile() imageUrl: Express.Multer.File, @Request() request: IResponseJwt) {
        body.tenantId = request.user.tenantId;
        return await this.clientesService.update(id, body, imageUrl);
    }

    @Delete(':id')
    @UseGuards(createPermissionsGuard('DELETE'))
    @ApiOperation({ summary: 'Remover cliente' })
    @ApiParam({ name: 'id', description: 'ID do cliente' })
    @ApiResponse({ status: 200, description: 'Cliente removido com sucesso' })
    async remove(@Param('id') id: string, @Request() request: IResponseJwt) {
        const tenantId = request.user.tenantId;
        return await this.clientesService.remove(id, tenantId);
    }
}
