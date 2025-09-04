import requestApi from ".";
import { DashboardKpis } from '../types/dashboard';

const dashboardService = {
  async getKpis(): Promise<DashboardKpis> {
    const response = await requestApi.get('/dashboard/kpis');
    return response as unknown as DashboardKpis;
  },
};

export default dashboardService;
