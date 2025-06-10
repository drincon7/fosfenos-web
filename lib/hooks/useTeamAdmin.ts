import { useState, useEffect } from 'react';
import { useTeamAdmin as useTeamData } from './useTeam';
import { useAdminApi } from './useAdminApi';

export interface TeamMemberAdmin {
  id: string;
  nombre: string;
  cargo: string;
  imagen: string;
  imagenDark?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useTeamAdmin() {
  const { data: teamMembers, loading, error, ...rest } = useTeamData();
  const api = useAdminApi<TeamMemberAdmin>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  const createMember = async (data: {
    id: string;
    nombre: string;
    cargo: string;
    imagen?: File | null;
    imagenDark?: File | null;
    active: boolean;
  }) => {
    // Aquí implementarías la subida de imágenes si es necesario
    const memberData = {
      nombre: data.nombre,
      cargo: data.cargo,
      imagen: data.imagen ? '/images/team/default.jpg' : '/images/team/default.jpg', // Por ahora usar default
      imagenDark: data.imagenDark ? '/images/team/default.jpg' : '/images/team/default.jpg',
      active: data.active,
      order: (teamMembers?.length || 0) + 1
    };

    const result = await api.post('/api/admin/team', memberData);
    
    if (result.success) {
      refresh();
    }
    
    return result;
  };

  const updateMember = async (id: string, data: Partial<TeamMemberAdmin>) => {
    const result = await api.put(`/api/admin/team/${id}`, data);
    
    if (result.success) {
      refresh();
    }
    
    return result;
  };

  const deleteMember = async (id: string) => {
    const result = await api.delete(`/api/admin/team/${id}`);
    
    if (result.success) {
      refresh();
    }
    
    return result;
  };

  // Trigger refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      // Esto triggereará una recarga de los datos
      window.location.reload(); // Temporal - mejor implementar un sistema de cache más sofisticado
    }
  }, [refreshTrigger]);

  return {
    teamMembers,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember,
    refresh,
    ...rest
  };
}