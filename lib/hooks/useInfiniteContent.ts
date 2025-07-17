// lib/hooks/useInfiniteContent.ts
import { useState, useEffect, useCallback } from 'react';
import type { InfiniteContentItem, InfiniteContentFilters } from '@/types/infiniteContent';

interface UseInfiniteContentReturn {
  data: InfiniteContentItem[] | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } | null;
  updateFilters: (newFilters: Partial<InfiniteContentFilters>) => void;
  refresh: () => void;
}

export const useInfiniteContent = (initialFilters: InfiniteContentFilters = {}): UseInfiniteContentReturn => {
  const [data, setData] = useState<InfiniteContentItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } | null>(null);
  
  const [filters, setFilters] = useState<InfiniteContentFilters>({
    page: 1,
    pageSize: 10,
    orderBy: 'order',
    orderDirection: 'asc',
    ...initialFilters
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir URL con parámetros de consulta
      const searchParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/admin/infinite-content?${searchParams.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error HTTP: ${response.status}`);
      }

      if (result.success) {
        setData(result.data);
        setPagination({
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages
        });
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (err) {
      console.error('Error fetching infinite content:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      setData(null);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<InfiniteContentFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Efecto para cargar datos cuando cambien los filtros
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    updateFilters,
    refresh
  };
};