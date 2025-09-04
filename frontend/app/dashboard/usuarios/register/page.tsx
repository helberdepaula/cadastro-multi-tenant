'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { UsuariosService } from '@/service/usuarios-service';
import Button from '@/app/component/Button';
import Content from '@/app/component/Layout/Content';
import RouteProtector from '@/components/RouteProtector';

const userSchema = z.object({
    name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
        .max(100, { message: 'O nome deve ter no máximo 100 caracteres' }),
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),

    role: z.enum(['ADMIN', 'USER', 'GUEST'], {
        message: 'Selecione um perfil válido'
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
});

type UserFormData = z.infer<typeof userSchema>;

export default function UsuarioRegisterPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'USER',
        }
    });

    const onSubmit = async (data: UserFormData) => {
        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            const { ...userData } = data;

            await UsuariosService.create(userData);
            router.push('/dashboard/usuarios');
            router.refresh();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error &&
                typeof error.response === 'object' && error.response !== null &&
                'data' in error.response &&
                typeof error.response.data === 'object' && error.response.data !== null &&
                'message' in error.response.data
                ? String(error.response.data.message)
                : 'Erro ao criar usuário. Tente novamente.';
            setErrorMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <RouteProtector requiredPermission="canCreateUsers">
            <div className="w-full mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard/usuarios')}
                            className="flex items-center gap-2 text-gray-600
                             hover:text-gray-800 transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Novo Usuário</h1>
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
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
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
                                className={`w-full px-4 py-2 border 
                                    rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Senha */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register('password')}
                                    className={`w-full px-4 py-2
                                         border rounded-md focus:outline-none 
                                        focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} className="text-gray-500" />
                                    ) : (
                                        <Eye size={18} className="text-gray-500" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register('confirmPassword')}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                                        focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} className="text-gray-500" />
                                    ) : (
                                        <Eye size={18} className="text-gray-500" />
                                    )}
                                </button>
                            </div>
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
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-300' : 'border-gray-300'
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
                            variant='outline'
                        >
                            Cancelar
                        </Button>
                        <Button variant='primary'
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Salvando...dgsdfg
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
