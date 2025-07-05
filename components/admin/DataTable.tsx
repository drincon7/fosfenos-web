// components/admin/DataTable.tsx (VERSIÓN ACTUALIZADA)
'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onAdd?: () => void;
  searchPlaceholder?: string;
  title?: string;
  description?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  additionalActions?: (record: T) => React.ReactNode;
  showSearch?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading,
  onEdit,
  onDelete,
  onAdd,
  searchPlaceholder = "Buscar...",
  title,
  description,
  emptyStateTitle = "No hay datos",
  emptyStateDescription = "No se encontraron elementos.",
  pagination,
  onPageChange,
  additionalActions,
  showSearch = true
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filtrar datos localmente solo si no hay paginación del servidor
  const filteredData = !pagination ? data.filter(item => {
    if (!searchTerm) return true;
    
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : data;

  // Ordenar datos localmente solo si no hay paginación del servidor
  const sortedData = !pagination ? [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }) : filteredData;

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderCell = (column: Column<T>, record: T) => {
    const value = typeof column.key === 'string' && column.key.includes('.') 
      ? column.key.split('.').reduce((obj, key) => obj?.[key], record)
      : record[column.key as keyof T];
    
    return column.render ? column.render(value, record) : String(value || '');
  };

  // Componente de paginación
  const PaginationComponent = () => {
    if (!pagination || !onPageChange) return null;

    const { page, totalPages, total, pageSize } = pagination;
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    // Generar páginas para mostrar
    const getPageNumbers = (): (number | string)[] => {
      const delta = 2;
      const range: number[] = [];
      const rangeWithDots: (number | string)[] = [];

      for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
        range.push(i);
      }

      if (page - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (page + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {startItem} a {endItem} de {total} elementos
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              icon={<ChevronLeft size={16} />}
            >
              Anterior
            </Button>

            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pageNum, index) => (
                pageNum === '...' ? (
                  <span key={index} className="px-2 py-1 text-gray-500">...</span>
                ) : (
                  <button
                    key={index}
                    onClick={() => onPageChange(pageNum as number)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      pageNum === page
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              icon={<ChevronRight size={16} />}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <div className="h-64 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando datos..." />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || onAdd) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
          {onAdd && (
            <Button onClick={onAdd} icon={<span className="text-lg">+</span>}>
              Añadir
            </Button>
          )}
        </div>
      )}

      <Card padding={false}>
        {/* Filters */}
        {showSearch && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <Button variant="secondary" icon={<Filter size={16} />}>
                Filtros
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        {sortedData.length === 0 ? (
          <EmptyState
            title={emptyStateTitle}
            description={emptyStateDescription}
            icon={<Search size={48} />}
            action={onAdd && (
              <Button onClick={onAdd}>
                Añadir primer elemento
              </Button>
            )}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(String(column.key))}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.title}</span>
                        {column.sortable && (
                          <div className="flex flex-col">
                            <ChevronUp 
                              size={12} 
                              className={
                                sortConfig?.key === column.key && sortConfig.direction === 'asc'
                                  ? 'text-purple-600' 
                                  : 'text-gray-400'
                              } 
                            />
                            <ChevronDown 
                              size={12} 
                              className={
                                sortConfig?.key === column.key && sortConfig.direction === 'desc'
                                  ? 'text-purple-600' 
                                  : 'text-gray-400'
                              } 
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  {(onEdit || onDelete || additionalActions) && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {renderCell(column, record)}
                      </td>
                    ))}
                    {(onEdit || onDelete || additionalActions) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {additionalActions && additionalActions(record)}
                          {onEdit && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onEdit(record)}
                            >
                              Editar
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => onDelete(record)}
                            >
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <PaginationComponent />
      </Card>
    </div>
  );
}