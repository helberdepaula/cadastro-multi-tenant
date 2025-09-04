'use client';

import { useAuthInitializer } from '@/hooks/useAuthInitializer';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useAuthInitializer();
  
  return <>{children}</>;
}
