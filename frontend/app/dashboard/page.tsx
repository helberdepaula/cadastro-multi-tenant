
'use client'

import { useEffect, useState } from 'react';
import dashboardService from '@/service/dashboard-service';
import { DashboardKpis } from '@/types/dashboard';
import Widget from '../component/Widget';

export default function Dashboard() {
    const [kpis, setKpis] = useState<DashboardKpis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKpis = async () => {
            try {
                const data = await dashboardService.getKpis();
                setKpis(data);
            } catch (error) {
                console.error('Erro ao carregar KPIs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchKpis();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Widget
                        title='Total de Clientes'
                        value={kpis?.totalClientes || 0}
                        icon={
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        } />

                    <Widget
                        title='Clientes Ativos'
                        value={kpis?.totalClientesAtivos || 0}
                        icon={
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        } />
                    <Widget
                        title='Clientes Inativos'
                        value={kpis?.totalClientesInativos || 0}
                        icon={
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        } />
                    <Widget
                        title='% Clientes Ativos'
                        value={kpis?.percentualClientesAtivos || 0}
                        icon={
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        } />
                </div>

                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo dos Indicadores</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Status dos Clientes</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="text-gray-600">Total Registrados</span>
                                    <span className="font-semibold">{kpis?.totalClientes || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                                    <span className="text-green-700">Ativos</span>
                                    <span className="font-semibold text-green-700">{kpis?.totalClientesAtivos || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                    <span className="text-red-700">Inativos</span>
                                    <span className="font-semibold text-red-700">{kpis?.totalClientesInativos || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Taxa de Ativação</h3>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-blue-700 font-medium">Percentual de Clientes Ativos</span>
                                    <span className="text-2xl font-bold text-blue-700">{kpis?.percentualClientesAtivos || 0}%</span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${kpis?.percentualClientesAtivos || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}