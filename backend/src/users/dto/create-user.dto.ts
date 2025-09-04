import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID do tenant do usuário' })
  @IsOptional()
  tenantId: string;

  @ApiProperty({
    description: 'Endereço de email do usuário (deve ser único no sistema)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (será armazenada com hash)',
    minLength: 6,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'ID do role do usuário (ex.: ADMIN, USER, GUEST)',
    enum: ['ADMIN', 'USER', 'GUEST'],
  })
  role: 'ADMIN' | 'USER' | 'GUEST';


}
