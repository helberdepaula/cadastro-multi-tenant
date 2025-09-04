import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export const useAuthInitializer = () => {
  const initializeAuth = useAuthStore((state: any) => state.initializeAuth);

  useEffect(() => {
    // Inicializar autenticação apenas no cliente
    if (typeof window !== 'undefined') {
      initializeAuth();
    }
  }, [initializeAuth]);
};
