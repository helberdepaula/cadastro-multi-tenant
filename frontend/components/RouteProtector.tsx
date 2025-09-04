'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';

interface RouteProtectorProps {
  children: React.ReactNode;
  requiredPermission?: keyof import('@/hooks/usePermissions').RolePermissions;
  route?: string;
  fallbackRoute?: string;
}

const RouteProtector: React.FC<RouteProtectorProps> = ({
  children,
  requiredPermission,
  route,
  fallbackRoute = '/dashboard'
}) => {
  const router = useRouter();
  const { hasPermission, canAccessRoute } = usePermissions();

  useEffect(() => {

    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push(fallbackRoute);
      return;
    }


    if (route && !canAccessRoute(route)) {
      router.push(fallbackRoute);
      return;
    }
  }, [requiredPermission, route, hasPermission, canAccessRoute, router, fallbackRoute]);

 
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  if (route && !canAccessRoute(route)) {
    return null;
  }

  return <>{children}</>;
};

export default RouteProtector;
