import { usePaginatedApi } from './useApi';

export interface Brand {
  id: string;
  name: string;
  href: string;
  image: string;
  imageLight: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseBrandsParams {
  search?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
}

export function useBrands(params: UseBrandsParams = {}) {
  return usePaginatedApi<Brand>('/api/public/brands', {
    active: true,
    pageSize: 50,
    ...params
  });
}