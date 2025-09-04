'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { UsuariosService } from '@/service/usuarios-service';
import { Usuario } from '@/types/usuarios';
import React from 'react';
import Button from '@/app/component/Button';
import Content from '@/app/component/Layout/Content';
import RouteProtector from '@/components/RouteProtector';


const userEditSchema = z.object({
    name: z.string()
        .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
        .max(100, { message: 'O nome deve ter no máximo 100 caracteres' }),
    email: z.string()
        .email({ message: 'Email inválido' }),
    password: z.string()
        .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
        .optional()
        .or(z.literal('')),
    confirmPassword: z.string()
        .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
        .optional()
        .or(z.literal('')),
    role: z.enum(['ADMIN', 'USER', 'GUEST'], {
        message: 'Selecione um perfil válido'
    }),
}).refine(data => !data.password || data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
});

type UserEditFormData = z.infer<typeof userEditSchema>;

export default function UsuarioEditPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    const router = useRouter();

    // No Next.js 15.5.2+, params pode ser uma Promise ou um objeto
    const resolvedParams = 'then' in params ? React.use(params) : params;
    const id = resolvedParams.id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [result, setResult] = useState<Usuario | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserEditFormData>({
        resolver: zodResolver(userEditSchema)
    });

    useEffect(() => {
        const loadUsuario = async () => {
            try {
                setIsLoading(true);
                const data = await UsuariosService.get(id);
                setResult(data);
            } catch {
                setErrorMessage('Não foi possível carregar os dados do usuário.');
            } finally {
                setIsLoading(false);
            }
        };
        loadUsuario();
    }, [id, reset]);

    const onSubmit = async (data: UserEditFormData) => {
        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            const { ...userData } = data;
            if (!userData.password) {
                delete userData.password;
            }

            await UsuariosService.update(id, userData);
            router.push('/dashboard/usuarios');
            router.refresh();
        } catch (error: unknown) {
            console.error('Erro ao atualizar usuário:', error);
            const errorMessage = error instanceof Error && 'response' in error &&
                typeof error.response === 'object' && error.response !== null &&
                'data' in error.response &&
                typeof error.response.data === 'object' && error.response.data !== null &&
                'message' in error.response.data
                ? String(error.response.data.message)
                : 'Erro ao atualizar usuário. Tente novamente.';
            setErrorMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result === null && isLoading) {
        return (<div className="bg-white rounded-lg shadow-sm p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>)
    }

    return (
        <RouteProtector requiredPermission="canEditUsers">
            <div className="w-full py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Editar Usuário</h1>
                </div>
            </div>
            <Content className="p-6">
                {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <div>
                                <p className="text-sm text-red-700">{errorMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nome
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                defaultValue={result?.name || ''}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 
                                    ${errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                defaultValue={result?.email || ''}
                                className={`w-full px-4 py-2 border rounded-md 
                                    focus:outline-none focus:ring-2
                                     focus:ring-blue-500 
                                     ${errors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Nova Senha <span className="text-gray-500 text-xs">(opcional)</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className={`w-full px-4 py-2 border rounded-md 
                                    focus:outline-none focus:ring-2 
                                    focus:ring-blue-500
                                     ${errors.password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Deixe em branco para manter a senha atual"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar Nova Senha <span className="text-gray-500 text-xs">(opcional)</span>
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register('confirmPassword')}
                                className={`w-full px-4 py-2 border rounded-md
                                     focus:outline-none focus:ring-2 focus:ring-blue-500
                                      ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Deixe em branco para manter a senha atual"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Perfil
                            </label>
                            <select
                                id="role"
                                {...register('role')}
                                defaultValue={result?.role || ''}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                <option value="ADMIN">Administrador</option>
                                <option value="USER">Usuário</option>
                                <option value="GUEST">Convidado</option>
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-8">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            variant="outline"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Salvar
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Content>
        </div>
        </RouteProtector>
    );
}
