// app/admin/infinite-content/page.tsx (CORREGIDA)
'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { useInfiniteContent } from '@/lib/hooks/useInfiniteContent';
import { useInfiniteContentAdmin } from '@/lib/hooks/useInfiniteContentAdmin';
import { InfiniteContentModal } from '@/components/admin/InfiniteContentModal';
import type { InfiniteContentItem } from '@/types/infiniteContent';

interface TableColumn {
  key: string;
  title: string;
  render?: (value: any, record: InfiniteContentItem) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export default function InfiniteContentManagementPage() {
  const { data, loading, error, pagination, updateFilters, refresh } = useInfiniteContent();
  const { deleteItem } = useInfiniteContentAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InfiniteContentItem | null>(null);
  const [viewingItem, setViewingItem] = useState<InfiniteContentItem | null>(null);

  const columns: TableColumn[] = [
    {
      key: 'image',
      title: 'Imagen',
      render: (value: string) => (
        <div className="flex items-center">
          <img 
            src={value || '/images/content/default.jpg'} 
            alt="Imagen del contenido" 
            className="w-12 h-12 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/content/default.jpg';
            }}
          />
        </div>
      ),
      width: '80px'
    },
    {
      key: 'title',
      title: 'Título',
      sortable: true,
      render: (value: string, record: InfiniteContentItem) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500 line-clamp-1">{record.shortDescription}</div>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Descripción',
      render: (value: string) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-2" title={value || ''}>
            {value || 'Sin descripción'}
          </p>
        </div>
      )
    },
    {
      key: 'details',
      title: 'Detalles',
      render: (value: string[]) => (
        <div className="text-sm text-gray-600">
          {value && value.length > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {value.length} detalle{value.length !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-gray-400">Sin detalles</span>
          )}
        </div>
      )
    },
    {
      key: 'active',
      title: 'Estado',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
      sortable: true
    },
    {
      key: 'order',
      title: 'Orden',
      sortable: true,
      width: '80px',
      render: (value: number) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'updatedAt',
      title: 'Última actualización',
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-gray-500">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        );
      },
      sortable: true
    }
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: InfiniteContentItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleView = (item: InfiniteContentItem) => {
    setViewingItem(item);
  };

  const handleDelete = async (item: InfiniteContentItem) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${item.title}"?`)) {
      try {
        const result = await deleteItem(item.id);
        if (result.success) {
          refresh();
        } else {
          alert(`Error al eliminar: ${result.error}`);
        }
      } catch (error) {
        console.error('Error eliminando elemento:', error);
        alert('Error al eliminar el elemento');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    setEditingItem(null);
    refresh();
  };

  const handleSearch = (searchTerm: string) => {
    updateFilters({ search: searchTerm, page: 1 });
  };

  const handleFilterChange = (filters: any) => {
    updateFilters({ ...filters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  // Mostrar error si existe
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Contenido Infinito"
          description="Error al cargar los datos"
        />
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar contenido infinito
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
              <div className="mt-3">
                <Button variant="secondary" onClick={refresh}>
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contenido Infinito"
        description="Gestiona el contenido para la cuadrícula infinita"
      >
        <Button onClick={handleAdd} icon={<Plus size={20} />}>
          Añadir Contenido
        </Button>
      </PageHeader>

      {/* Filtros adicionales */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, descripción..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onChange={(e) => handleFilterChange({ 
              active: e.target.value === '' ? undefined : e.target.value === 'true' 
            })}
          >
            <option value="">Todos los estados</option>
            <option value="true">Solo activos</option>
            <option value="false">Solo inactivos</option>
          </select>

          <Button 
            variant="secondary" 
            icon={<Filter size={16} />}
            onClick={() => updateFilters({ search: undefined, active: undefined, page: 1 })}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      {/* Tabla de datos */}
      <DataTable
        data={data || []}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar contenido..."
        emptyStateTitle="No hay contenido registrado"
        emptyStateDescription="Comienza añadiendo el primer elemento de contenido."
        pagination={pagination}
        onPageChange={handlePageChange}
        additionalActions={(record) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleView(record)}
            icon={<Eye size={16} />}
          >
            Ver
          </Button>
        )}
      />

      {/* Modal para crear/editar */}
      <InfiniteContentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        item={editingItem}
        onSaveSuccess={handleSaveSuccess}
      />

      {/* Modal para ver detalles */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {viewingItem.title}
                </h3>
                <button
                  onClick={() => setViewingItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <img 
                    src={viewingItem.image} 
                    alt={viewingItem.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/content/default.jpg';
                    }}
                  />
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción corta:</h4>
                  <p className="text-gray-600">{viewingItem.shortDescription}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción completa:</h4>
                  <p className="text-gray-600">{viewingItem.description}</p>
                </div>
                
                {viewingItem.details && viewingItem.details.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Detalles:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {viewingItem.details.map((detail, index) => (
                        <li key={index} className="text-gray-600">{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    <div>Orden: {viewingItem.order}</div>
                    <div>Estado: {viewingItem.active ? 'Activo' : 'Inactivo'}</div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => setViewingItem(null)}
                    >
                      Cerrar
                    </Button>
                    <Button
                      onClick={() => {
                        setViewingItem(null);
                        handleEdit(viewingItem);
                      }}
                      icon={<Edit size={16} />}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}