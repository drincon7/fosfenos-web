// lib/hooks/useInfiniteContentAdmin.ts
import { useState, useCallback } from 'react';
import type { InfiniteContentItem, CreateInfiniteContentData } from '@/types/infiniteContent';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface UploadResponse {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export const useInfiniteContentAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Función para crear un nuevo elemento
  const createItem = useCallback(async (data: CreateInfiniteContentData): Promise<ApiResponse<InfiniteContentItem>> => {
    setLoading(true);
    try {
      // Preparar FormData para enviar imagen y datos
      const formData = new FormData();
      
      // Añadir campos de texto
      formData.append('title', data.title);
      formData.append('shortDescription', data.shortDescription);
      formData.append('description', data.description);
      formData.append('details', JSON.stringify(data.details || []));
      formData.append('active', String(data.active));

      // Añadir imagen si existe
      if (data.image && data.image instanceof File) {
        formData.append('image', data.image);
      } else if (typeof data.image === 'string') {
        // Si es una URL de imagen existente
        formData.append('imageUrl', data.image);
      }

      const response = await fetch('/api/admin/infinite-content', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Error HTTP: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error creating infinite content item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al crear elemento'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar un elemento existente
  const updateItem = useCallback(async (
    id: string, 
    data: Partial<CreateInfiniteContentData>
  ): Promise<ApiResponse<InfiniteContentItem>> => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Añadir solo los campos que se están actualizando
      if (data.title !== undefined) formData.append('title', data.title);
      if (data.shortDescription !== undefined) formData.append('shortDescription', data.shortDescription);
      if (data.description !== undefined) formData.append('description', data.description);
      if (data.details !== undefined) formData.append('details', JSON.stringify(data.details));
      if (data.active !== undefined) formData.append('active', String(data.active));

      // Manejar imagen
      if (data.image !== undefined) {
        if (data.image instanceof File) {
          formData.append('image', data.image);
        } else if (typeof data.image === 'string') {
          formData.append('imageUrl', data.image);
        }
      }

      const response = await fetch(`/api/admin/infinite-content/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Error HTTP: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error updating infinite content item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al actualizar elemento'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para eliminar un elemento
  const deleteItem = useCallback(async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/infinite-content/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Error HTTP: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error deleting infinite content item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al eliminar elemento'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para subir una imagen independientemente
  const uploadImage = useCallback(async (file: File, folder = 'infinite-content'): Promise<UploadResponse> => {
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Error HTTP: ${response.status}`);
      }

      return {
        success: true,
        url: result.data?.url || result.data?.path,
        path: result.data?.path
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al subir imagen'
      };
    } finally {
      setUploadLoading(false);
    }
  }, []);

  // Función para reordenar elementos
  const reorderItems = useCallback(async (itemsWithNewOrder: { id: string; order: number }[]): Promise<ApiResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/infinite-content/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsWithNewOrder }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Error HTTP: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error reordering items:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al reordenar elementos'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para alternar el estado activo de un elemento
  const toggleActive = useCallback(async (id: string, currentActive: boolean): Promise<ApiResponse<InfiniteContentItem>> => {
    return updateItem(id, { active: !currentActive });
  }, [updateItem]);

  // Función para duplicar un elemento
  const duplicateItem = useCallback(async (item: InfiniteContentItem): Promise<ApiResponse<InfiniteContentItem>> => {
    const duplicateData: CreateInfiniteContentData = {
      title: `${item.title} (Copia)`,
      shortDescription: item.shortDescription,
      description: item.description,
      image: item.image, // Mantener la misma imagen
      details: [...item.details],
      active: false, // Crear como inactivo por defecto
    };

    return createItem(duplicateData);
  }, [createItem]);

  // Función para mover elemento hacia arriba
  const moveUp = useCallback(async (id: string): Promise<ApiResponse<InfiniteContentItem>> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/infinite-content/${id}/move-up`, {
        method: 'PUT',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Error HTTP: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error moving item up:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al mover elemento'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para mover elemento hacia abajo
  const moveDown = useCallback(async (id: string): Promise<ApiResponse<InfiniteContentItem>> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/infinite-content/${id}/move-down`, {
        method: 'PUT',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Error HTTP: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error moving item down:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al mover elemento'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estados
    loading,
    uploadLoading,
    
    // Operaciones CRUD
    createItem,
    updateItem,
    deleteItem,
    
    // Operaciones adicionales
    uploadImage,
    reorderItems,
    toggleActive,
    duplicateItem,
    moveUp,
    moveDown,
  };
};