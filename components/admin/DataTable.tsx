'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, MoreHorizontal } from 'lucide-react';
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
  emptyStateDescription = "No se encontraron elementos."
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filtrar datos
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Ordenar datos
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

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
                  {(onEdit || onDelete) && (
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
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
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

        {/* Footer */}
        {sortedData.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {sortedData.length} de {data.length} elementos
                {searchTerm && ` (filtrado por "${searchTerm}")`}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}