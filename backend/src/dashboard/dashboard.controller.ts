import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { IResponseJwt } from 'src/auth/jwt.strategy';
import { DashboardService } from './dashboard.service';
import { DashboardKpisDto } from './dto/dashboard-kpis.dto';

@Controller('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('kpis')
    @ApiOperation({ summary: 'Dashboard KPIs' })
    @ApiResponse({ 
        status: 200, 
        description: 'KPIs do dashboard retornados com sucesso',
        type: DashboardKpisDto
    })
    async getKpis(@Request() request: IResponseJwt): Promise<DashboardKpisDto> {
        const tenantId = request.user.tenantId;
        return this.dashboardService.getKpis(tenantId);
    }
}
