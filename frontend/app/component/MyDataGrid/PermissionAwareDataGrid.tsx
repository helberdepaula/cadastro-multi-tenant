"use client";

import React from "react";
import MyDataGrid from "./index";
import { usePermissions } from "@/hooks/usePermissions";

interface Page {
  page: number;
  per_page: number;
  total: number;
}

interface DataRow {
  id: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

interface FilteredActions {
  actionView?: (id: string | number) => void;
  actionEdit?: (id: string | number) => void;
  actionRemove?: (id: string | number) => void;
}

interface PermissionAwareDataGridProps {
  data: DataRow[];
  page?: Page;
  columnLabels?: Record<string, string>;
  actionCustom?: (id: string | number) => void;
  actionView?: (id: string | number) => void;
  actionEdit?: (id: string | number) => void;
  actionRemove?: (id: string | number) => void;
  actionRow?: (id: string | number) => void;
  handlerPager?: (pg: number) => void;
  entityType: 'users' | 'clients';
}

const PermissionAwareDataGrid: React.FC<PermissionAwareDataGridProps> = ({
  entityType,
  actionView,
  actionEdit,
  actionRemove,
  ...props
}) => {
  const { permissions } = usePermissions();

  const getFilteredActions = (): FilteredActions => {
    const filteredActions: FilteredActions = {};

    if (entityType === 'users') {
      if (permissions.canViewUsers && actionView) {
        filteredActions.actionView = actionView;
      }
      if (permissions.canEditUsers && actionEdit) {
        filteredActions.actionEdit = actionEdit;
      }
      if (permissions.canDeleteUsers && actionRemove) {
        filteredActions.actionRemove = actionRemove;
      }
    } else if (entityType === 'clients') {
      if (permissions.canViewClients && actionView) {
        filteredActions.actionView = actionView;
      }
      if (permissions.canEditClients && actionEdit) {
        filteredActions.actionEdit = actionEdit;
      }
      if (permissions.canDeleteClients && actionRemove) {
        filteredActions.actionRemove = actionRemove;
      }
    }

    return filteredActions;
  };

  const filteredActions = getFilteredActions();

  return (
    <MyDataGrid
      {...props}
      {...filteredActions}
    />
  );
};

export default PermissionAwareDataGrid;
