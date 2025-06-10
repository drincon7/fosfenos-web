'use client';
import { useState } from 'react';
import { Users, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { TeamMemberModal } from '@/components/admin/TeamMemberModal';
import { useTeamAdmin } from '@/lib/hooks/useTeamAdmin';

export default function TeamManagementPage() {
  const { teamMembers, loading, createMember, updateMember, deleteMember } = useTeamAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const columns = [
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
      render: (value: string, record: any) => (
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

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setShowModal(true);
  };

  const handleDelete = async (member: any) => {
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
        onClose={() => setShowModal(false)}
        member={editingMember}
        onSave={handleSave}
      />
    </div>
  );
}