// lib/hooks/useInfiniteContent.ts
import { useState, useEffect } from 'react';
import type { 
  InfiniteContentItem, 
  InfiniteContentFilters, 
  InfiniteContentResponse 
} from '@/types/infiniteContent';

interface UseInfiniteContentOptions {
  initialFilters?: Partial<InfiniteContentFilters>;
  autoFetch?: boolean;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const useInfiniteContent = (options: UseInfiniteContentOptions = {}) => {
  const { initialFilters = {}, autoFetch = true } = options;
  
  const [data, setData] = useState<InfiniteContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const defaultFilters: InfiniteContentFilters = {
    page: 1,
    pageSize: 10,
    orderBy: 'order',
    orderDirection: 'asc',
    ...initialFilters
  };

  const [filters, setFilters] = useState<InfiniteContentFilters>(defaultFilters);

  // Computed pagination object
  const pagination: Pagination = {
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages
  };

  const fetchData = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      
      if (currentFilters.search) searchParams.append('search', currentFilters.search);
      if (currentFilters.active !== undefined) searchParams.append('active', currentFilters.active.toString());
      if (currentFilters.orderBy) searchParams.append('orderBy', currentFilters.orderBy);
      if (currentFilters.orderDirection) searchParams.append('orderDirection', currentFilters.orderDirection);
      searchParams.append('page', currentFilters.page.toString());
      searchParams.append('pageSize', currentFilters.pageSize.toString());

      const response = await fetch(`/api/admin/infinite-content?${searchParams}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al cargar datos');
      }

      if (result.success) {
        setData(result.data.data);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching infinite content:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<InfiniteContentFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchData(updatedFilters);
  };

  const refresh = () => {
    fetchData();
  };

  const refetch = async () => {
    await fetchData();
  };

  const goToPage = (page: number) => {
    updateFilters({ page });
  };

  const search = (searchTerm: string) => {
    updateFilters({ search: searchTerm, page: 1 });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    fetchData(defaultFilters);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch]);

  return {
    data,
    loading,
    error,
    total,
    totalPages,
    pagination,
    filters,
    updateFilters,
    refresh,
    refetch,
    goToPage,
    search,
    resetFilters,
    fetchData
  };
};