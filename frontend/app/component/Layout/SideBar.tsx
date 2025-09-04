'use client';

import Link from 'next/link';
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

const SideBar = () => {
  const { permissions } = usePermissions();

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] bg-white shadow flex flex-col py-8 px-4 fixed top-16 left-0 z-10">
      <nav className="flex flex-col gap-4">
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
          Dashboard
        </Link>
        
        {permissions.canViewClients && (
          <Link href="/dashboard/clientes" className="text-gray-700 hover:text-blue-600 font-medium">
            Clientes
          </Link>
        )}
        
        {permissions.canViewUsers && (
          <Link href="/dashboard/usuarios" className="text-gray-700 hover:text-blue-600 font-medium">
            Usuários
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default SideBar;
