import { useApi, usePaginatedApi } from './useApi';

export interface ChildContent {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  videoUrl: string;
  posterImage: string;
  synopsis: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  technicalInfo?: TechnicalInfo;
  awards: Award[];
  platforms: Platform[];
  additionalInfo?: AdditionalInfo;
}

export interface TechnicalInfo {
  id: string;
  formato: string;
  duracion: string;
  genero: string;
  publico: string;
  estado: string;
  empresaProductora: string;
  paisProductora: string;
  empresaCoproductora?: string;
  paisCoproductora?: string;
}

export interface Award {
  id: string;
  title: string;
  category: string;
  year: number;
  country: string;
  status: 'GANADOR' | 'NOMINACION' | 'MENCION';
  festival: string;
  order: number;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
  icon: string;
  order: number;
}

export interface AdditionalInfo {
  id: string;
  pressbook?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
}

interface UseChildContentParams {
  search?: string;
  published?: boolean;
  page?: number;
  pageSize?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'title' | 'order';
  orderDirection?: 'asc' | 'desc';
}

export function useChildContent(params: UseChildContentParams = {}) {
  return usePaginatedApi<ChildContent>('/api/public/child-content', {
    published: true,
    pageSize: 10,
    orderBy: 'order',
    orderDirection: 'asc',
    ...params
  });
}

export function useChildContentBySlug(slug: string) {
  return useApi<ChildContent>(`/api/public/child-content/${slug}`);
}
