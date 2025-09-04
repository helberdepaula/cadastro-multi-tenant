'use client'
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { payloadAuth } from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export default function Page() {

  const { login } = useAuthStore();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const schema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: payloadAuth) => {
    try {
      setErrorMessage(null);
      await login(data);
      router.push('/dashboard');
    } catch (error: unknown) {
      
      const isAxiosError = (err: unknown): err is { response?: { data?: { message?: string; error?: string } }; message?: string } => {
        return typeof err === 'object' && err !== null;
      };
      
      if (isAxiosError(error)) {
        if (error?.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else if (error?.response?.data?.error) {
          setErrorMessage(error.response.data.error);
        } else if (error?.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Erro interno do servidor. Tente novamente mais tarde.');
        }
      } else if (typeof error === 'string') {
        setErrorMessage(error);
      } else {
        setErrorMessage('Erro interno do servidor. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message as string}</span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message as string}</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                Entrando...
              </div>
            ) : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
