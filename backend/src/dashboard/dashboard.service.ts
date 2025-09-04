import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardKpisDto } from './dto/dashboard-kpis.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis(tenantId: string): Promise<DashboardKpisDto> {
    // Buscar total de clientes registrados
    const totalClientes = await this.prisma.cliente.count({
      where: {
        tenantId
      }
    });

    // Buscar total de clientes ativos
    const totalClientesAtivos = await this.prisma.cliente.count({
      where: {
        tenantId,
        isActive: true
      }
    });

    // Calcular clientes inativos
    const totalClientesInativos = totalClientes - totalClientesAtivos;

    // Calcular percentual de clientes ativos
    const percentualClientesAtivos = totalClientes > 0 
      ? Number(((totalClientesAtivos / totalClientes) * 100).toFixed(2))
      : 0;

    return {
      totalClientes,
      totalClientesAtivos,
      totalClientesInativos,
      percentualClientesAtivos
    };
  }
}
