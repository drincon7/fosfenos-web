// app/admin/infinite-content/page.tsx (MEJORADO)
'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter, MoreVertical, ArrowUp, ArrowDown, Copy, Power, PowerOff } from 'lucide-react';
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
  const { deleteItem, toggleActive, duplicateItem, moveUp, moveDown } = useInfiniteContentAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InfiniteContentItem | null>(null);
  const [viewingItem, setViewingItem] = useState<InfiniteContentItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const columns: TableColumn[] = [
    {
      key: 'order',
      title: '#',
      width: '60px',
      render: (value: number, record: InfiniteContentItem) => (
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-sm font-medium">{value}</span>
          <div className="flex gap-1">
            <button
              onClick={() => handleMoveUp(record)}
              disabled={actionLoading === `move-up-${record.id}`}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              title="Mover arriba"
            >
              <ArrowUp size={12} />
            </button>
            <button
              onClick={() => handleMoveDown(record)}
              disabled={actionLoading === `move-down-${record.id}`}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              title="Mover abajo"
            >
              <ArrowDown size={12} />
            </button>
          </div>
        </div>
      )
    },
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
          <div className="font-medium text-gray-900 line-clamp-1" title={value}>{value}</div>
          <div className="text-sm text-gray-500 line-clamp-1" title={record.shortDescription}>
            {record.shortDescription}
          </div>
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
      render: (value: boolean, record: InfiniteContentItem) => (
        <button
          onClick={() => handleToggleActive(record)}
          disabled={actionLoading === `toggle-${record.id}`}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
            value 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          } ${actionLoading === `toggle-${record.id}` ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={`Clic para ${value ? 'desactivar' : 'activar'}`}
        >
          {actionLoading === `toggle-${record.id}` ? (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
          ) : (
            value ? <Power size={12} className="mr-1" /> : <PowerOff size={12} className="mr-1" />
          )}
          {value ? 'Activo' : 'Inactivo'}
        </button>
      ),
      sortable: true
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
      setActionLoading(`delete-${item.id}`);
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
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleToggleActive = async (item: InfiniteContentItem) => {
    setActionLoading(`toggle-${item.id}`);
    try {
      const result = await toggleActive(item.id, item.active);
      if (result.success) {
        refresh();
      } else {
        alert(`Error al cambiar estado: ${result.error}`);
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar el estado');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (item: InfiniteContentItem) => {
    setActionLoading(`duplicate-${item.id}`);
    try {
      const result = await duplicateItem(item);
      if (result.success) {
        refresh();
      } else {
        alert(`Error al duplicar: ${result.error}`);
      }
    } catch (error) {
      console.error('Error duplicando elemento:', error);
      alert('Error al duplicar el elemento');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMoveUp = async (item: InfiniteContentItem) => {
    setActionLoading(`move-up-${item.id}`);
    try {
      const result = await moveUp(item.id);
      if (result.success) {
        refresh();
      } else {
        alert(`Error al mover: ${result.error}`);
      }
    } catch (error) {
      console.error('Error moviendo elemento:', error);
      alert('Error al mover el elemento');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMoveDown = async (item: InfiniteContentItem) => {
    setActionLoading(`move-down-${item.id}`);
    try {
      const result = await moveDown(item.id);
      if (result.success) {
        refresh();
      } else {
        alert(`Error al mover: ${result.error}`);
      }
    } catch (error) {
      console.error('Error moviendo elemento:', error);
      alert('Error al mover el elemento');
    } finally {
      setActionLoading(null);
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
}