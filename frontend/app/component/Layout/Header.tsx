'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import Button from '../Button';
import { useRouter } from 'next/navigation';

interface HeartProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'Administrador';
    case 'USER':
      return 'Usuário';
    case 'GUEST':
      return 'Visitante';
    default:
      return role;
  }
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

const Header: React.FC<HeartProps> = ({
  title = "Bem-vindo",
}) => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/dashboard');
      window.location.reload();
    } catch {
    }
  };

  return (
    <nav className="w-full h-16 bg-blue-600 
    flex items-center 
    justify-between px-6 
    shadow text-white font-semibold fixed 
    top-0 left-0 z-20">
      <span className="text-lg">{title}</span>

      {isAuthenticated && user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm">
              Olá, {user.name || user.email}
            </span>
            {user.role && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
            )}
          </div>
          <Button
            variant='secondary'
            onClick={handleLogout}
            className="px-3 py-1 "
          >
            Sair
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Header;
