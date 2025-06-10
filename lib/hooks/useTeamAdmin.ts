// lib/hooks/useTeamAdmin.ts
import { useState, useEffect, useCallback } from 'react';

// Tipos para los miembros del equipo
export interface TeamMember {
  id: string;
  nombre: string;
  cargo: string;
  imagen?: string;
  imagenDark?: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Tipos para crear/actualizar miembros
export interface CreateTeamMemberData {
  nombre: string;
  cargo: string;
  imagen?: File | null;
  imagenDark?: File | null;
  active: boolean;
}

export interface UpdateTeamMemberData extends CreateTeamMemberData {
  id?: string;
}

// Respuesta de la API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Estado del hook
interface TeamAdminState {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

export const useTeamAdmin = () => {
  const [state, setState] = useState<TeamAdminState>({
    teamMembers: [],
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
  });

  // Función para hacer peticiones a la API
  const makeApiRequest = async <T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const result: ApiResponse<T> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Error: ${response.status}`);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      throw new Error(errorMessage);
    }
  };

  // Cargar miembros del equipo
  const fetchTeamMembers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await makeApiRequest<TeamMember[]>('/api/admin/team');
      
      setState(prev => ({
        ...prev,
        loading: false,
        teamMembers: result.data || [],
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar miembros',
      }));
    }
  }, []);

  // Crear miembro del equipo
  const createMember = useCallback(async (
    data: CreateTeamMemberData
  ): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, creating: true, error: null }));

    try {
      // Si hay imágenes, las subimos primero
      let imageUrl = '';
      let imageDarkUrl = '';

      if (data.imagen) {
        const formData = new FormData();
        formData.append('file', data.imagen);
        formData.append('folder', 'team');

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          imageUrl = uploadResult.data.url;
        }
      }

      if (data.imagenDark) {
        const formData = new FormData();
        formData.append('file', data.imagenDark);
        formData.append('folder', 'team');

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          imageDarkUrl = uploadResult.data.url;
        }
      }

      // Crear el miembro con las URLs de las imágenes
      const memberData = {
        nombre: data.nombre,
        cargo: data.cargo,
        imagen: imageUrl,
        imagenDark: imageDarkUrl,
        active: data.active,
      };

      const result = await makeApiRequest<TeamMember>('/api/admin/team', {
        method: 'POST',
        body: JSON.stringify(memberData),
      });

      setState(prev => ({
        ...prev,
        creating: false,
        teamMembers: [...prev.teamMembers, result.data!],
        error: null,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear miembro';
      
      setState(prev => ({
        ...prev,
        creating: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // Actualizar miembro del equipo
  const updateMember = useCallback(async (
    id: string,
    data: CreateTeamMemberData
  ): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, updating: true, error: null }));

    try {
      // Subir imágenes si se proporcionaron
      let imageUrl = '';
      let imageDarkUrl = '';

      if (data.imagen instanceof File) {
        const formData = new FormData();
        formData.append('file', data.imagen);
        formData.append('folder', 'team');

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          imageUrl = uploadResult.data.url;
        }
      }

      if (data.imagenDark instanceof File) {
        const formData = new FormData();
        formData.append('file', data.imagenDark);
        formData.append('folder', 'team');

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          imageDarkUrl = uploadResult.data.url;
        }
      }

      // Actualizar el miembro
      const memberData: any = {
        nombre: data.nombre,
        cargo: data.cargo,
        active: data.active,
      };

      if (imageUrl) memberData.imagen = imageUrl;
      if (imageDarkUrl) memberData.imagenDark = imageDarkUrl;

      const result = await makeApiRequest<TeamMember>(`/api/admin/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(memberData),
      });

      setState(prev => ({
        ...prev,
        updating: false,
        teamMembers: prev.teamMembers.map(member =>
          member.id === id ? result.data! : member
        ),
        error: null,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar miembro';
      
      setState(prev => ({
        ...prev,
        updating: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // Eliminar miembro del equipo
  const deleteMember = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, deleting: true, error: null }));

    try {
      await makeApiRequest(`/api/admin/team/${id}`, {
        method: 'DELETE',
      });

      setState(prev => ({
        ...prev,
        deleting: false,
        teamMembers: prev.teamMembers.filter(member => member.id !== id),
        error: null,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar miembro';
      
      setState(prev => ({
        ...prev,
        deleting: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // Cargar datos al inicializar
  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    teamMembers: state.teamMembers,
    loading: state.loading,
    error: state.error,
    creating: state.creating,
    updating: state.updating,
    deleting: state.deleting,

    // Acciones
    createMember,
    updateMember,
    deleteMember,
    fetchTeamMembers,
    clearError,
  };
};