'use client';

import { useAuthStore } from '@/stores/auth-store';

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sair
    </button>
  );
}
