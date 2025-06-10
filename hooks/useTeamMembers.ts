// hooks/useTeamMembers.ts (SIMPLIFICAR)
import { useState, useCallback } from 'react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  imageDark?: string;
  order: number;
  active: boolean;
}

interface TeamMemberInput {
  name: string;
  position: string;
  image?: File | null;
  imageDark?: File | null;
  active: boolean;
}

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch team members
  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/team');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(data.data || []);
      } else {
        setError(data.error || 'Error al cargar miembros del equipo');
      }
    } catch (error) {
      setError('Error de conexión');
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create team member
  const createTeamMember = useCallback(async (memberData: TeamMemberInput) => {
    setLoading(true);
    setError(null);
    
    try {
      // Preparar FormData para subir archivos
      const formData = new FormData();
      formData.append('name', memberData.name);
      formData.append('position', memberData.position);
      formData.append('active', memberData.active.toString());
      
      if (memberData.image) {
        formData.append('image', memberData.image);
      }
      if (memberData.imageDark) {
        formData.append('imageDark', memberData.imageDark);
      }

      const response = await fetch('/api/admin/team', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchTeamMembers(); // Refrescar lista
        return { success: true };
      } else {
        const errorMsg = data.error || 'Error al crear miembro del equipo';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMsg = 'Error de conexión';
      setError(errorMsg);
      console.error('Error creating team member:', error);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [fetchTeamMembers]);

  // Update team member
  const updateTeamMember = useCallback(async (id: string, memberData: TeamMemberInput) => {
    setLoading(true);
    setError(null);
    
    try {
      // Preparar FormData
      const formData = new FormData();
      formData.append('name', memberData.name);
      formData.append('position', memberData.position);
      formData.append('active', memberData.active.toString());
      
      if (memberData.image) {
        formData.append('image', memberData.image);
      }
      if (memberData.imageDark) {
        formData.append('imageDark', memberData.imageDark);
      }

      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchTeamMembers(); // Refrescar lista
        return { success: true };
      } else {
        const errorMsg = data.error || 'Error al actualizar miembro del equipo';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMsg = 'Error de conexión';
      setError(errorMsg);
      console.error('Error updating team member:', error);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [fetchTeamMembers]);

  // Delete team member
  const deleteTeamMember = useCallback(async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
      return { success: false, error: 'Cancelado por el usuario' };
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchTeamMembers(); // Refrescar lista
        return { success: true };
      } else {
        const errorMsg = data.error || 'Error al eliminar miembro del equipo';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMsg = 'Error de conexión';
      setError(errorMsg);
      console.error('Error deleting team member:', error);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [fetchTeamMembers]);

  return {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
  };
};