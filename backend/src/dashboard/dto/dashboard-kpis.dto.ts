import { ApiProperty } from '@nestjs/swagger';

export class DashboardKpisDto {
  @ApiProperty({
    description: 'Total de clientes registrados',
    example: 150
  })
  totalClientes: number;

  @ApiProperty({
    description: 'Total de clientes ativos',
    example: 142
  })
  totalClientesAtivos: number;

  @ApiProperty({
    description: 'Total de clientes inativos',
    example: 8
  })
  totalClientesInativos: number;

  @ApiProperty({
    description: 'Percentual de clientes ativos',
    example: 94.67
  })
  percentualClientesAtivos: number;
}
