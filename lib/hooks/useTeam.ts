import { usePaginatedApi } from './useApi';

export interface TeamMember {
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

interface UseTeamParams {
  search?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
}

export function useTeam(params: UseTeamParams = {}) {
  return usePaginatedApi<TeamMember>('/api/public/team', {
    active: true, // Solo miembros activos por defecto
    pageSize: 50, // Obtener todos los miembros por defecto
    ...params
  });
}

export function useTeamAdmin(params: UseTeamParams = {}) {
  return usePaginatedApi<TeamMember>('/api/admin/team', {
    pageSize: 20,
    ...params
  });
}