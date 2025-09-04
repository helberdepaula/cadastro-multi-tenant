import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createPermissionsGuard } from './permissions.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserQuerySwagger } from './swagger/swagger.helper';
import { FilterUserDto } from './dto/filterUser.dto';
import type { IResponseJwt } from 'src/auth/jwt.strategy';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UseGuards(createPermissionsGuard('CREATE'))
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  create(@Body() createUserDto: CreateUserDto, @Request() request: IResponseJwt) {
    createUserDto.tenantId = request.user.tenantId;
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(createPermissionsGuard('READ'))
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @UserQuerySwagger()
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  findAll(@Query() query: FilterUserDto, @Request() request: IResponseJwt) {
    query.tenantId = request.user.tenantId;
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(createPermissionsGuard('READ'))
  @ApiOperation({ summary: 'Buscar um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id') id: string, @Request() request: IResponseJwt) {
    const tenantId = request.user.tenantId;
    return this.usersService.findOne(id, tenantId);
  }

  @Put(':id')
  @UseGuards(createPermissionsGuard('UPDATE'))
  @ApiOperation({ summary: 'Atualizar dados de um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário atualizados com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() request: IResponseJwt) {
    updateUserDto.tenantId = request.user.tenantId;
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(createPermissionsGuard('DELETE'))
  @ApiOperation({ summary: 'Desativar um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário desativado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string, @Request() request: IResponseJwt) {
    const tenantId = request.user.tenantId;
    return this.usersService.remove(id, tenantId);
  }

}
