import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterUserDto {

  @ApiProperty({ description: 'Página ' })
  @IsOptional()
  page: string;

  @ApiProperty({ description: 'Página ' })
  @IsOptional()
  limit: string;

  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'ID do tenant do usuário' })
  @IsOptional()
  tenantId: string;

  @ApiProperty({
    description: 'Endereço de email do usuário (deve ser único no sistema)',
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'ID do role do usuário (ex.: ADMIN, USER, GUEST)',
    enum: ['ADMIN', 'USER', 'GUEST'],
  })
  @IsOptional()
  role: 'ADMIN' | 'USER' | 'GUEST';

}
