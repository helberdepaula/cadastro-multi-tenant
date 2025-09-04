import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateClienteDto {

  @IsOptional()
  tenantId: string;
  
  @IsOptional()
  publicId: string;

  @ApiProperty({ example: 'Cliente Exemplo' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'cliente@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: true })
  isActive?: boolean = true;

  @ApiProperty({ example: '+55 11 99999-9999' })
  @IsString()
  contact: string;

  @ApiProperty({ example: '12345-678' })
  @IsString()
  zip_code: string;

  @ApiProperty({ example: 'Rua das Flores' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  neighborhood: string;

  @ApiProperty({ example: '123' })
  @IsString()
  number: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Apartamento 45', required: false })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ example: 'https://url.com/imagem.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
