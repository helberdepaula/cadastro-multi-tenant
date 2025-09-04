'use client'

import { ClientesService } from "@/service/clientes-service";
import { Cliente, Address } from "@/types/clientes";
import { ArrowLeft, Edit, Mail, MapPin, Phone, User, Calendar, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function VisualizarClientePage() {
    const params = useParams();
    const router = useRouter();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const clienteId = params.id as string;

    const loadCliente = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ClientesService.get(clienteId);
            setCliente(response);
        } catch {
            setError("Erro ao carregar os dados do cliente");
        } finally {
            setLoading(false);
        }
    }, [clienteId]);

    useEffect(() => {
        if (clienteId) {
            loadCliente();
        }
    }, [clienteId, loadCliente]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAddress = (address: Address | undefined) => {
        if (!address) return 'Endereço não informado';

        const parts = [
            address.street,
            address.number,
            address.complement,
            address.neighborhood,
            address.city,
            address.state,
            address.zip_code
        ].filter(Boolean);

        return parts.join(', ') || 'Endereço não informado';
    };

    if (loading) {
        return (
            <div className="w-full mx-auto py-6">
                <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error || !cliente) {
        return (
            <div className="w-full mx-auto py-6">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-red-300 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mt-2">{error || "Cliente não encontrado"}</h3>
                        <button
                            onClick={() => router.push('/dashboard/clientes')}
                            className="mt-4 flex items-center gap-2 bg-blue-600 
                            cursor-pointer
                            hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                        >
                            <ArrowLeft size={16} />
                            Voltar para clientes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/dashboard/clientes')}
                        className="flex items-center justify-center 
                        w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-md 
                        cursor-pointer
                        transition-colors duration-200"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Visualizar Cliente</h1>
                        <p className="text-gray-600 mt-1">Informações detalhadas do cliente</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push(`/dashboard/clientes/${clienteId}/edit`)}
                    className="mt-3 md:mt-0 flex items-center 
                    gap-2 bg-blue-600 hover:bg-blue-700 text-white 
                    px-4 py-2 rounded-md font-medium transition-colors 
                    cursor-pointer
                    duration-200"
                >
                    <Edit size={16} />
                    Editar cliente
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            {cliente.imageUrl ? (
                                <Image
                                    src={String(process.env.NEXT_PUBLIC_STATIC_URL) + cliente.imageUrl}
                                    alt={cliente.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                    width={96}
                                    height={96}
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                                    <User size={40} className="text-white" />
                                </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${cliente.isActive ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                {cliente.isActive ? (
                                    <Eye size={16} className="text-white" />
                                ) : (
                                    <EyeOff size={16} className="text-white" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">{cliente.name}</h2>
                            <p className="text-blue-100 mt-1">ID Público: {cliente.publicId}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${cliente.isActive
                                        ? 'bg-green-500/20 text-green-100 border border-green-300/30'
                                        : 'bg-red-500/20 text-red-100 border border-red-300/30'
                                    }`}>
                                    {cliente.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Phone size={20} className="text-blue-600" />
                                Informações de Contato
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail size={18} className="text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="text-gray-800 font-medium">{cliente.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone size={18} className="text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-600">Telefone</p>
                                        <p className="text-gray-800 font-medium">{cliente.contact}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-blue-600" />
                                Endereço
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed">
                                    {formatAddress(cliente.address)}
                                </p>
                                {cliente.address?.zip_code && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        CEP: {cliente.address.zip_code}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-blue-600" />
                            Informações do Sistema
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">ID do Cliente</p>
                                <p className="text-gray-800 font-medium font-mono text-sm break-all">{cliente.id}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">Data de Criação</p>
                                <p className="text-gray-800 font-medium">{formatDate(cliente.createdAt)}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">Última Atualização</p>
                                <p className="text-gray-800 font-medium">{formatDate(cliente.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
