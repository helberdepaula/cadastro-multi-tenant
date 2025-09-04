'use client';

import { useAuthStore } from '@/stores/auth-store';
import { UserRole } from '@/types/auth';

export interface RolePermissions {
  canViewDashboard: boolean;
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewClients: boolean;
  canCreateClients: boolean;
  canEditClients: boolean;
  canDeleteClients: boolean;
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  ADMIN: {
    canViewDashboard: true,
    canViewUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: true,
  },
  USER: {
    canViewDashboard: true,
    canViewUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: true,
  },
  GUEST: {
    canViewDashboard: true,
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewClients: true,
    canCreateClients: false,
    canEditClients: false,
    canDeleteClients: false,
  },
};

export const usePermissions = () => {
  const { user } = useAuthStore();
  
  const getUserPermissions = (): RolePermissions => {
    if (!user || !user.role) {
      return rolePermissions.GUEST;
    }
    return rolePermissions[user.role] || rolePermissions.GUEST;
  };

  const permissions = getUserPermissions();

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  const canAccessRoute = (route: string): boolean => {
    if (route === '/dashboard') {
      return permissions.canViewDashboard;
    }
    
    if (route.startsWith('/dashboard/usuarios')) {
      if (route.includes('/register')) {
        return permissions.canCreateUsers;
      }
      if (route.includes('/edit')) {
        return permissions.canEditUsers;
      }
      return permissions.canViewUsers;
    }
    
    if (route.startsWith('/dashboard/clientes')) {
      if (route.includes('/register')) {
        return permissions.canCreateClients;
      }
      if (route.includes('/edit')) {
        return permissions.canEditClients;
      }
      return permissions.canViewClients;
    }
    
    return false;
  };

  return {
    permissions,
    hasPermission,
    canAccessRoute,
    userRole: user?.role || 'GUEST',
  };
};
