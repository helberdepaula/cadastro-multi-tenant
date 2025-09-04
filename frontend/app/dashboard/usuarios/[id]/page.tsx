'use client'

import { UsuariosService } from "@/service/usuarios-service";
import { Usuario } from "@/types/usuarios";
import { ArrowLeft, User, Mail, Shield, Calendar, Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import Button from "@/app/component/Button";

export default function VisualizarUsuarioPage() {
    const router = useRouter();
    const params = useParams();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const userId = params?.id as string;

    const loadUsuario = useCallback(async () => {
        if (!userId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await UsuariosService.get(userId);
            setUsuario(response);
        } catch (error: unknown) {
            console.error("Erro ao carregar usuário:", error);
            setError("Erro ao carregar dados do usuário");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadUsuario();
    }, [loadUsuario]);



    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-800';
            case 'USER':
                return 'bg-blue-100 text-blue-800';
            case 'GUEST':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'Administrador';
            case 'USER':
                return 'Usuário';
            case 'GUEST':
                return 'Convidado';
            default:
                return role;
        }
    };

    if (loading) {
        return (
            <div className="w-full mx-auto py-6">
                <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error || !usuario) {
        return (
            <div className="w-full mx-auto py-6">
                <div className="flex items-center mb-6">
                    <Button
                        variant='secondary'
                        onClick={() => router.push('/dashboard/usuarios')}
                    >
                        <ArrowLeft size={20} />
                        Voltar para usuários
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-10">
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-red-300 mb-3">
                            <User size={64} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mt-2">
                            {error || "Usuário não encontrado"}
                        </h3>
                        <p className="text-gray-500 mt-2 text-center">
                            Não foi possível carregar os dados do usuário
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Detalhes do Usuário</h1>
                </div>

                <button
                    onClick={() => router.push(`/dashboard/usuarios/${usuario.id}/edit`)}
                    className="flex items-center cursor-pointer gap-2 
                    bg-blue-600 hover:bg-blue-700 text-white px-4 
                    py-2 rounded-md font-medium transition-colors 
                    cursor-pointer duration-200 text-sm"
                >
                    <User size={16} />
                    Editar usuário
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 
                            rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{usuario.name}</h2>
                                <p className="text-gray-600">{usuario.email}</p>
                            </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(usuario.role)}`}>
                            {getRoleLabel(usuario.role)}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                                Informações Pessoais
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nome</p>
                                        <p className="font-medium text-gray-800">{usuario.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-800">{usuario.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Função</p>
                                        <span className={`inline-flex px-2 py-1 rounded-full 
                                            text-xs font-medium ${getRoleBadgeColor(usuario.role)}`}>
                                            {getRoleLabel(usuario.role)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                                Informações do Sistema
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-gray-400 rounded text-white text-xs 
                                    flex items-center justify-center">
                                        ID
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">ID do Usuário</p>
                                        <p className="font-mono text-sm text-gray-800">{usuario.id}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-gray-400 rounded text-white text-xs 
                                    flex items-center justify-center">
                                        T
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tenant ID</p>
                                        <p className="font-mono text-sm text-gray-800">{usuario.tenantId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Data de Criação</p>
                                        <p className="font-medium text-gray-800">{formatDate(usuario.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Última Atualização</p>
                                        <p className="font-medium text-gray-800">{formatDate(usuario.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
