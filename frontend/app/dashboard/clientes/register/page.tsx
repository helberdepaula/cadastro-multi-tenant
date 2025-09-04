'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ClientesService } from '@/service/clientes-service';
import {  format as formatMask } from "@react-input/mask";
import Button from '@/app/component/Button';
import Content from '@/app/component/Layout/Content';
import RouteProtector from '@/components/RouteProtector';

const addressSchema = z.object({
    zip_code: z.string().optional(),
    street: z.string().min(1, { message: 'Rua é obrigatória' }),
    neighborhood: z.string().min(1, { message: 'Bairro é obrigatório' }),
    number: z.string().min(1, { message: 'Número é obrigatório' }),
    state: z.string().min(2, { message: 'Estado deve ter 2 caracteres' }).max(2),
    city: z.string().optional(),
    complement: z.string().optional(),
});

const clienteSchema = z.object({
    name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
        .max(100, { message: 'O nome deve ter no máximo 100 caracteres' }),
    email: z.string().email({ message: 'Email inválido' }),
    contact: z.string().min(1, { message: 'Contato é obrigatório' }),
    address: addressSchema,
    imageUrl: z.any().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export default function ClienteRegisterPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoadingCep, setIsLoadingCep] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<ClienteFormData>({
        resolver: zodResolver(clienteSchema)
    });

    const searchCep = async (zip_code: string) => {
        if (zip_code.length !== 8) return;
        setErrorMessage('');
        setIsLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${zip_code}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setValue('address.street', data.logradouro || '');
                setValue('address.neighborhood', data.bairro || '');
                setValue('address.city', data.localidade || '');
                setValue('address.state', data.uf || '');
            } else {
                setErrorMessage('CEP não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            setErrorMessage('Erro ao buscar CEP');
        } finally {
            setIsLoadingCep(false);
        }
    };

    const onSubmit = async (data: ClienteFormData) => {
        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            const formData = { ...data };
            const { imageUrl, address, ...clienteData } = formData;
            const finalData: Record<string, unknown> = {
                ...clienteData,
                ...address,
            };

            if (imageUrl && imageUrl[0]) {
                finalData.imageUrl = imageUrl[0];
            }

            await ClientesService.create(finalData);
            router.push('/dashboard/clientes');
            router.refresh();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error && 
                typeof error.response === 'object' && error.response !== null &&
                'data' in error.response && 
                typeof error.response.data === 'object' && error.response.data !== null &&
                'message' in error.response.data
                ? String(error.response.data.message)
                : 'Erro ao criar cliente. Tente novamente.';
            setErrorMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <RouteProtector requiredPermission="canCreateClients">
            <div className="w-full mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Novo Cliente</h1>
                </div>
            </div>

            <Content className=" p-6">
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
                                className={`w-full px-4 py-2 border 
                                    rounded-md focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
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
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                                Contato
                            </label>
                            <Controller
                                name="contact"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <input
                                        id="contact"
                                        type="text"
                                        value={value}
                                        onChange={(e) => {
                                            const maskedValue = formatMask(e.target.value, {
                                                mask: '(##) #####-####',
                                                replacement: { '#': /\d/ }
                                            });
                                            onChange(maskedValue);
                                        }}
                                        placeholder="(11) 99999-9999"
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                                            focus:ring-2
                                             focus:ring-blue-500 ${errors.contact ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                )}
                            />
                            {errors.contact && (
                                <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">
                                Imagem do Cliente (opcional)
                            </label>
                            <div className="flex flex-col space-y-2">
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    {...register('imageUrl')}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-medium
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />

                                {errors.imageUrl && (
                                    <p className="mt-1 text-sm text-red-600">{String(errors.imageUrl?.message || 'Erro no arquivo')}</p>
                                )}

                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Endereço</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                                        CEP
                                    </label>
                                    <Controller
                                        name="address.zip_code"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <input
                                                id="zip_code"
                                                type="text"
                                                value={value}
                                                onChange={(e) => {
                                                    const maskedValue = formatMask(e.target.value, {
                                                        mask: '#####-###',
                                                        replacement: { '#': /\d/ }
                                                    });
                                                    onChange(maskedValue);
                                                    const zip_code = maskedValue.replace(/\D/g, '');
                                                    if (zip_code.length === 8) {
                                                        searchCep(zip_code);
                                                    }
                                                }}
                                                placeholder="12345-678"
                                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.zip_code ? 'border-red-300' : 'border-gray-300'}`}
                                            />
                                        )}
                                    />
                                    {isLoadingCep && (
                                        <p className="mt-1 text-sm text-blue-600">Buscando CEP...</p>
                                    )}
                                    {errors.address?.zip_code && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address.zip_code.message}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                                        Rua *
                                    </label>
                                    <input
                                        id="street"
                                        type="text"
                                        {...register('address.street')}
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.street ? 'border-red-300' : 'border-gray-300'}`}
                                    />
                                    {errors.address?.street && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                                        Número *
                                    </label>
                                    <input
                                        id="number"
                                        type="text"
                                        {...register('address.number')}
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.number ? 'border-red-300' : 'border-gray-300'}`}
                                    />
                                    {errors.address?.number && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address.number.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bairro *
                                    </label>
                                    <input
                                        id="neighborhood"
                                        type="text"
                                        {...register('address.neighborhood')}
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.neighborhood ? 'border-red-300' : 'border-gray-300'}`}
                                    />
                                    {errors.address?.neighborhood && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address.neighborhood.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        Cidade
                                    </label>
                                    <input
                                        id="city"
                                        type="text"
                                        {...register('address.city')}
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.city ? 'border-red-300' : 'border-gray-300'}`}
                                    />
                                    {errors.address?.city && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado *
                                    </label>
                                    <input
                                        id="state"
                                        type="text"
                                        {...register('address.state')}
                                        placeholder="SP"
                                        maxLength={2}
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.state ? 'border-red-300' : 'border-gray-300'}`}
                                    />
                                    {errors.address?.state && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
                                        Complemento
                                    </label>
                                    <input
                                        id="complement"
                                        type="text"
                                        {...register('address.complement')}
                                        placeholder="Apto, Bloco, etc."
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.complement ? 'border-red-300' : 'border-gray-300'}`}
                                    />
                                    {errors.address?.complement && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address.complement.message}</p>
                                    )}
                                </div>
                            </div>
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
