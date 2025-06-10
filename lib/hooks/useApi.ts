import { useState, useEffect } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface PaginatedApiState<T> extends ApiState<T[]> {
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export function useApi<T>(url: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await fetch(url);
        const result = await response.json();

        if (!isMounted) return;

        if (result.success) {
          setState({
            data: result.data,
            loading: false,
            error: null
          });
        } else {
          setState({
            data: null,
            loading: false,
            error: result.error || 'Unknown error occurred'
          });
        }
      } catch (error) {
        if (!isMounted) return;
        
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Network error'
        });
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
}

export function usePaginatedApi<T>(
  baseUrl: string, 
  params: Record<string, string | number | boolean | undefined> = {}
): PaginatedApiState<T> {
  const [state, setState] = useState<PaginatedApiState<T>>({
    data: null,
    loading: true,
    error: null,
    pagination: undefined
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Construir query string
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });

        const url = `${baseUrl}?${queryParams.toString()}`;
        const response = await fetch(url);
        const result = await response.json();

        if (!isMounted) return;

        if (result.success) {
          setState({
            data: result.data || [],
            loading: false,
            error: null,
            pagination: result.pagination
          });
        } else {
          setState({
            data: null,
            loading: false,
            error: result.error || 'Unknown error occurred',
            pagination: undefined
          });
        }
      } catch (error) {
        if (!isMounted) return;
        
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Network error',
          pagination: undefined
        });
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [baseUrl, JSON.stringify(params)]); // Dependency on serialized params

  return state;
}