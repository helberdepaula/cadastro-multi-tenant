"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  User,
  Trash2,
  SquareActivity
} from 'lucide-react';

interface Page {
  page: number;
  per_page: number;
  total: number;
}

interface DataRow {
  id: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

interface MyDataGridProps {
  data: DataRow[];
  page?: Page;
  columnLabels?: Record<string, string>;
  actionCustom?: (id: string | number) => void;
  actionView?: (id: string | number) => void;
  actionEdit?: (id: string | number) => void;
  actionRemove?: (id: string | number) => void;
  actionRow?: (id: string | number) => void;
  handlerPager?: (pg: number) => void;
}

const MyDataGrid: React.FC<MyDataGridProps> = ({
  data,
  columnLabels = {},
  page = { page: 1, total: 10, per_page: 10 },
  actionCustom,
  actionView,
  actionEdit,
  actionRemove,
  actionRow,
  handlerPager,
}) => {
  const [currentPage, setCurrentPage] = useState(page.page);
  const initialRenderRef = useRef(true);
  const columnHelper = createColumnHelper<DataRow>();

  // Cria colunas apenas para as chaves especificadas em columnLabels
  const columns = Object.keys(columnLabels).map((key) =>
    columnHelper.accessor((row) => row[key], {
      id: key,
      header: columnLabels[key],
      cell: (info) => {
        const value = info.getValue();
        return String(value ?? '');
      },
    })
  );

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = page.per_page > 0 ? Math.ceil(page.total / page.per_page) : 0;
  const totalReg = page.total;
  const itemsPerPage = page.per_page;

  // Memoize these functions to prevent unnecessary rerenders
  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);
  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Reset current page if the total pages or initial page changes
  useEffect(() => {
    setCurrentPage(page.page);
  }, [page.page, page.total]);  // Store the handlerPager in a ref to avoid dependency changes
  const handlerPagerRef = useRef(handlerPager);

  // Update the ref when handlerPager changes
  useEffect(() => {
    handlerPagerRef.current = handlerPager;
  }, [handlerPager]);

  // Only call handlerPager when currentPage actually changes
  useEffect(() => {
    // Skip the first render to prevent double-fetching on component mount
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if (handlerPagerRef.current && currentPage !== page.page) {
      handlerPagerRef.current(currentPage);
    }
  }, [currentPage, page.page]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup, key) => (
            <tr key={key} className="border-b border-gray-200">
              {headerGroup.headers.map((header, _key) => (
                <th key={_key} className="px-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
              {(actionView || actionEdit || actionRemove) &&
                <th key={`${key}-acoes`} className="px-6 py-4 text-right text-sm font-medium text-gray-500 tracking-wider">
                  AÇÕES
                </th>}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row, key) => (
              <tr
                key={key}
                className="border-b border-gray-100 hover:bg-gray-50"
                style={{ cursor: actionRow ? 'pointer' : 'default' }}
                onClick={() => {
                  if (actionRow) actionRow(row.original.id);
                }}
              >
                {row.getVisibleCells().map((cell, _key) => (
                  <td
                    key={_key}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {(actionView || actionEdit || actionRemove || actionCustom) &&
                  <td key={`${key}-acoes`} className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      {actionCustom && (
                        <button
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Dar baixa no estoque"
                          onClick={(e) => {
                            e.stopPropagation();
                            actionCustom(row.original.id);
                          }}
                        >
                          <SquareActivity size={18} />
                        </button>
                      )}
                      {actionView && (
                        <button
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Ver detalhes"
                          onClick={(e) => {
                            e.stopPropagation();
                            actionView(row.original.id);
                          }}
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {actionEdit && (
                        <button
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Editar"
                          onClick={(e) => {
                            e.stopPropagation();
                            actionEdit(row.original.id);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {actionRow && (
                        <button
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Ver perfil"
                          onClick={(e) => {
                            e.stopPropagation();
                            actionRow(row.original.id);
                          }}
                        >
                          <User size={18} />
                        </button>
                      )}
                      {actionRemove && (
                        <button
                          className="p-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          title="Remover"
                          onClick={(e) => {
                            e.stopPropagation();
                            actionRemove(row.original.id);
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actionView || actionEdit || actionRemove ? 1 : 0)} className="py-6 text-center text-gray-500">
                Nenhum registro encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>        {/* Paginação */}
      {totalPages > 0 && (
        <div className="flex justify-between items-center py-4 px-6 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalReg)} a {Math.min(currentPage * itemsPerPage, totalReg)} de {totalReg} registros
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center text-sm ${currentPage === 1 ? 'text-gray-400' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Anterior</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center">
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mx-0.5 ${page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))
              ) : (
                // Show smart pagination for more than 5 pages
                <>
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mx-0.5 ${1 === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="px-1 text-gray-500">...</span>}
                    </>
                  )}

                  {Array.from({ length: 3 }, (_, i) => {
                    const page = currentPage - 1 + i;
                    if (page < 1 || page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mx-0.5 ${page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-1 text-gray-500">...</span>}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mx-0.5 ${totalPages === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center text-sm ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <span className="mr-1">Próximo</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDataGrid;
