'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { useServices } from '@/lib/hooks/useServices';
import type { AdminService } from '@/types/service';

interface TableColumn {
  key: string;
  title: string;
  render?: (value: any, record: AdminService) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export default function ServicesManagementPage() {
  const { data: services, loading, error } = useServices();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(null);

  // Transformamos los datos del hook para asegurar compatibilidad
  const processedServices: AdminService[] = (services || []).map(service => ({
    ...service,
    title: service.title || service.name,
    category: service.category || 'General',
    active: service.active ?? true,
  }));

  const columns: TableColumn[] = [
    {
      key: 'name',
      title: 'Servicio',
      sortable: true,
      render: (value: string, record: AdminService) => (
        <div>
          <div className="font-medium text-gray-900">{record.title || value}</div>
          <div className="text-sm text-gray-500">{record.category || 'Sin categoría'}</div>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Descripción',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value || ''}>
          {value || 'Sin descripción'}
        </div>
      )
    },
    {
      key: 'price',
      title: 'Precio',
      render: (value: number) => (
        value ? `$${value.toLocaleString()}` : 'Consultar'
      ),
      sortable: true
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
      )
    },
    {
      key: 'updatedAt',
      title: 'Última actualización',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A',
      sortable: true
    }
  ];

  const handleAdd = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleEdit = (service: AdminService) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDelete = async (service: AdminService) => {
    const serviceName = service.title || service.name;
    if (window.confirm(`¿Estás seguro de que quieres eliminar el servicio "${serviceName}"?`)) {
      try {
        // TODO: Implementar lógica de eliminación
        console.log('Eliminar servicio:', service.id);
        // Aquí llamarías a tu API para eliminar el servicio
        // await deleteService(service.id);
      } catch (error) {
        console.error('Error eliminando servicio:', error);
      }
    }
  };

  // Mostrar error si existe
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Gestión de Servicios"
          description="Error al cargar los datos de servicios"
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
                Error al cargar servicios
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
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
        title="Gestión de Servicios"
        description="Administra los servicios que ofrece Fosfenos Media"
      >
        <Button onClick={handleAdd} icon={<Plus size={20} />}>
          Añadir Servicio
        </Button>
      </PageHeader>

      {/* Vista temporal mientras se implementa la funcionalidad completa */}
      {!processedServices || processedServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Settings size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gestión de Servicios
          </h3>
          <p className="text-gray-600 mb-4">
            {loading 
              ? "Cargando servicios..." 
              : "La gestión completa de servicios estará disponible pronto."
            }
          </p>
          <Button onClick={handleAdd} icon={<Plus size={20} />}>
            Añadir Primer Servicio
          </Button>
        </div>
      ) : (
        <DataTable
          data={processedServices}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Buscar servicios..."
          emptyStateTitle="No hay servicios registrados"
          emptyStateDescription="Comienza añadiendo el primer servicio de la empresa."
        />
      )}

      {/* TODO: Implementar modal para crear/editar servicios */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad en desarrollo...
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setShowModal(false)}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}