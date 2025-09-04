'use client'
import PermissionAwareDataGrid from "@/app/component/MyDataGrid/PermissionAwareDataGrid";
import { UsuariosService } from "@/service/usuarios-service";
import { UsuariosResponse } from "@/types/usuarios";
import { UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useConfirmation } from "@/components/ConfirmationDialog";
import IsEmpty from "@/app/component/Layout/IsEmpty";
import Loading from "@/app/component/Layout/Loading";
import Content from "@/app/component/Layout/Content";
import { usePermissions } from "@/hooks/usePermissions";

export default function UsuarioPage() {
    const router = useRouter();
    const { confirm } = useConfirmation();
    const { permissions } = usePermissions();
    const [result, setResult] = useState<UsuariosResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setfilter] = useState<{ name: string, email: string }>({ name: '', email: '' });
    const [page, setPage] = useState<number>(1);

    const loadData = useCallback((params: { name?: string; email?: string; page?: number } = {}) => {
        setLoading(true);
        UsuariosService.list(params).then((response) => {
            setResult(response);
        }).catch((error) => {
            console.error("Erro ao carregar dados:", error);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleDeleteUser = async (id: string | number) => {
        const confirmed = await confirm({
            title: 'Excluir usuário',
            message: 'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.',
            confirmLabel: 'Excluir',
            cancelLabel: 'Cancelar'
        });

        if (!confirmed) {
            return;
        }

        try {
            await UsuariosService.delete(id.toString());
            loadData();
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
        }
    };

    useEffect(() => {
        loadData({ ...filter, page });
    }, [loadData, filter, page]);

    return (
        <div className="w-full mx-auto py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
                {permissions.canCreateUsers && (
                    <button
                        onClick={() => router.push('/dashboard/usuarios/register')}
                        className="mt-3 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm"
                    >
                        <UserPlus size={16} />
                        Adicionar usuário
                    </button>
                )}
            </div>

            <Content className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
                        <input
                            type="text"
                            value={filter.name}
                            onChange={(e) => setfilter({ ...filter, name: e.target.value })}
                            placeholder="Buscar por nome"
                            className="w-full px-4 py-2 text-gray-700 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="text"
                            value={filter.email}
                            onChange={(e) => setfilter({ ...filter, email: e.target.value })}
                            placeholder="Buscar por email"
                            className="w-full px-4 py-2 text-gray-700 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        />
                    </div>
                </div>
            </Content>

            {loading ? (
                <Loading />
            ) : result?.data && result.data.length > 0 ? (
                <Content>
                    <PermissionAwareDataGrid
                        entityType="users"
                        data={result.data.map(usuario => ({
                            id: usuario.id,
                            name: usuario.name,
                            email: usuario.email,
                            role: usuario.role,
                        }))}
                        handlerPager={setPage}
                        page={{
                            page: result.meta?.page || 1,
                            per_page: result.meta?.limit || 10,
                            total: result.meta?.total || 0
                        }}
                        columnLabels={{
                            name: 'NOME',
                            email: 'EMAIL',
                            role: 'FUNÇÃO'
                        }}
                        actionEdit={(id: string | number) => router.push(`/dashboard/usuarios/${id}/edit`)}
                        actionView={(id: string | number) => router.push(`/dashboard/usuarios/${id}`)}
                        actionRemove={(id: string | number) => handleDeleteUser(id)}
                    />
                </Content>
            ) : (
                <IsEmpty
                    title="Nenhum usuário encontrado"
                    subtitle="Tente ajustar os filtros ou adicione um novo usuário" />
            )}
        </div>
    );
}