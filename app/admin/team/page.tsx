'use client';
import { useState } from 'react';
import { Users, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { TeamMemberModal } from '@/components/admin/TeamMemberModal';
import { useTeamAdmin, type TeamMember } from '@/lib/hooks/useTeamAdmin';

// Definición de las columnas de la tabla
interface TableColumn {
  key: string;
  title: string;
  render?: (value: any, record: TeamMember) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export default function TeamManagementPage() {
  const { teamMembers, loading, createMember, updateMember, deleteMember, error } = useTeamAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const columns: TableColumn[] = [
    {
      key: 'imagen',
      title: 'Foto',
      render: (value: string) => (
        <div className="flex items-center">
          <img 
            src={value || '/images/team/default.jpg'} 
            alt="Foto del miembro" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      ),
      width: '80px'
    },
    {
      key: 'nombre',
      title: 'Nombre',
      sortable: true,
      render: (value: string, record: TeamMember) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{record.cargo}</div>
        </div>
      )
    },
    {
      key: 'cargo',
      title: 'Cargo',
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
          {value ? (
            <>
              <UserCheck size={12} className="mr-1" />
              Activo
            </>
          ) : (
            <>
              <UserX size={12} className="mr-1" />
              Inactivo
            </>
          )}
        </span>
      )
    },
    {
      key: 'order',
      title: 'Orden',
      sortable: true,
      width: '80px'
    },
    {
      key: 'updatedAt',
      title: 'Última actualización',
      render: (value: string) => new Date(value).toLocaleDateString(),
      sortable: true
    }
  ];

  const handleAdd = () => {
    setEditingMember(null);
    setShowModal(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowModal(true);
  };

  const handleDelete = async (member: TeamMember) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${member.nombre}?`)) {
      await deleteMember(member.id);
    }
  };

  const handleSave = async (data: any) => {
    if (editingMember) {
      return await updateMember(editingMember.id, data);
    } else {
      return await createMember(data);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  // Mostrar error si existe
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Gestión del Equipo"
          description="Error al cargar los datos del equipo"
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
                Error al cargar el equipo
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
        title="Gestión del Equipo"
        description="Administra los miembros del equipo de Fosfenos Media"
      />

      <DataTable
        data={teamMembers || []}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar miembros..."
        emptyStateTitle="No hay miembros del equipo"
        emptyStateDescription="Comienza añadiendo el primer miembro del equipo."
      />

      <TeamMemberModal
        isOpen={showModal}
        onClose={handleCloseModal}
        member={editingMember}
        onSave={handleSave}
      />
    </div>
  );
}