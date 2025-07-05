// lib/hooks/useInfiniteContentAdmin.ts
import { useState } from 'react';
import type { 
  InfiniteContentItem, 
  CreateInfiniteContentData 
} from '@/types/infiniteContent';

export const useInfiniteContentAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createItem = async (data: CreateInfiniteContentData): Promise<{ success: boolean; data?: InfiniteContentItem; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/infinite-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear elemento');
      }

      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, data: Partial<CreateInfiniteContentData>): Promise<{ success: boolean; data?: InfiniteContentItem; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/infinite-content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar elemento');
      }

      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/infinite-content/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar elemento');
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const reorderItems = async (items: { id: string; order: number }[]): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/infinite-content/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al reordenar elementos');
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'infinite-content');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al subir imagen');
      }

      return { success: true, url: result.data.url };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
    uploadImage
  };
};