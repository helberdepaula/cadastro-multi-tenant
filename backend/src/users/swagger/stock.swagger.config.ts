import { ApiQueryOptions } from '@nestjs/swagger';
export const UserSwaggerConfig = {
  id: { type: String, example: 'a1b2c3d4-uuid-user', description: 'ID do usuário' },
  email: { type: String, example: 'usuario@email.com', description: 'Email do usuário' },
  password: { type: String, example: 'senhaSegura123', description: 'Senha do usuário' },
  name: { type: String, example: 'João Silva', description: 'Nome do usuário' },
  createdAt: { type: Date, example: '2025-08-30T12:00:00.000Z', description: 'Data de criação' },
  updatedAt: { type: Date, example: '2025-08-30T12:00:00.000Z', description: 'Data de atualização' },
};

export const userQueryParams: ApiQueryOptions[] = [
  {
    name: 'name',
    required: false,
    description: 'Filtrar por nome do usuário',
  },
  {
    name: 'email',
    required: false,
    description: 'Filtrar por email',
  },
  {
    name: 'page',
    required: false,
    description: 'Número da página',
    type: Number,
  },
  {
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página',
    type: Number,
  },
];
