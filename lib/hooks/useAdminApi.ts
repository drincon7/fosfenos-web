// lib/hooks/useAdminApi.ts - Versión mejorada
import { useState, useCallback } from 'react';

// Opciones personalizadas para el hook
interface CustomApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
}

// Combinamos las opciones personalizadas con RequestInit
interface ApiRequestConfig {
  fetchOptions?: RequestInit;
  customOptions?: CustomApiOptions;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Estado del hook
interface ApiState {
  loading: boolean;
  error: string | null;
  data: any;
}

// Hook personalizado para operaciones de API del admin
export const useAdminApi = () => {
  const [state, setState] = useState<ApiState>({
    loading: false,
    error: null,
    data: null
  });

  // Función helper para hacer peticiones HTTP
  const makeRequest = useCallback(async <T = any>(
    url: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    const { fetchOptions = {}, customOptions = {} } = config;
    const {
      onSuccess,
      onError,
      showSuccessMessage = false,
      showErrorMessage = true,
    } = customOptions;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        ...fetchOptions,
      });

      const result: ApiResponse<T> = await response.json();

      if (!response.ok || !result.success) {
        const errorMessage = result.error || `Error: ${response.status}`;
        
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage 
        }));

        if (showErrorMessage) {
          console.error('API Error:', errorMessage);
        }

        if (onError) {
          onError(errorMessage);
        }

        return result;
      }

      setState(prev => ({ 
        ...prev, 
        loading: false, 
        data: result.data,
        error: null 
      }));

      if (showSuccessMessage && result.message) {
        console.log('API Success:', result.message);
      }

      if (onSuccess) {
        onSuccess(result.data);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));

      if (showErrorMessage) {
        console.error('Network Error:', errorMessage);
      }

      if (onError) {
        onError(errorMessage);
      }

      return { success: false, error: errorMessage };
    }
  }, []);

  // Métodos HTTP específicos
  const get = useCallback(<T = any>(
    url: string, 
    customOptions?: CustomApiOptions,
    fetchOptions?: Omit<RequestInit, 'method'>
  ) => {
    return makeRequest<T>(url, {
      fetchOptions: { ...fetchOptions, method: 'GET' },
      customOptions
    });
  }, [makeRequest]);

  const post = useCallback(<T = any>(
    url: string, 
    data?: any, 
    customOptions?: CustomApiOptions,
    fetchOptions?: Omit<RequestInit, 'method' | 'body'>
  ) => {
    return makeRequest<T>(url, {
      fetchOptions: {
        ...fetchOptions,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      customOptions
    });
  }, [makeRequest]);

  const put = useCallback(<T = any>(
    url: string, 
    data?: any, 
    customOptions?: CustomApiOptions,
    fetchOptions?: Omit<RequestInit, 'method' | 'body'>
  ) => {
    return makeRequest<T>(url, {
      fetchOptions: {
        ...fetchOptions,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      customOptions
    });
  }, [makeRequest]);

  const patch = useCallback(<T = any>(
    url: string, 
    data?: any, 
    customOptions?: CustomApiOptions,
    fetchOptions?: Omit<RequestInit, 'method' | 'body'>
  ) => {
    return makeRequest<T>(url, {
      fetchOptions: {
        ...fetchOptions,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      customOptions
    });
  }, [makeRequest]);

  const del = useCallback(<T = any>(
    url: string, 
    customOptions?: CustomApiOptions,
    fetchOptions?: Omit<RequestInit, 'method'>
  ) => {
    return makeRequest<T>(url, {
      fetchOptions: { ...fetchOptions, method: 'DELETE' },
      customOptions
    });
  }, [makeRequest]);

  // Función para subir archivos
  const uploadFile = useCallback(async (
    url: string,
    file: File,
    customOptions: CustomApiOptions = {},
    fetchOptions: Omit<RequestInit, 'method' | 'body'> = {}
  ) => {
    const {
      onSuccess,
      onError,
      showSuccessMessage = false,
      showErrorMessage = true,
    } = customOptions;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        ...fetchOptions,
        // No incluir Content-Type para FormData, el browser lo maneja automáticamente
        headers: {
          ...fetchOptions.headers,
          // No incluimos Content-Type aquí para FormData
        },
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        const errorMessage = result.error || `Error: ${response.status}`;
        
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage 
        }));

        if (showErrorMessage) {
          console.error('Upload Error:', errorMessage);
        }

        if (onError) {
          onError(errorMessage);
        }

        return result;
      }

      setState(prev => ({ 
        ...prev, 
        loading: false, 
        data: result.data,
        error: null 
      }));

      if (showSuccessMessage && result.message) {
        console.log('Upload Success:', result.message);
      }

      if (onSuccess) {
        onSuccess(result.data);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al subir archivo';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));

      if (showErrorMessage) {
        console.error('Upload Network Error:', errorMessage);
      }

      if (onError) {
        onError(errorMessage);
      }

      return { success: false, error: errorMessage };
    }
  }, []);

  // Función para limpiar el estado
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearData = useCallback(() => {
    setState(prev => ({ ...prev, data: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    // Estado
    loading: state.loading,
    error: state.error,
    data: state.data,
    
    // Métodos HTTP
    get,
    post,
    put,
    patch,
    delete: del,
    uploadFile,
    
    // Métodos de utilidad
    clearError,
    clearData,
    reset,
    
    // Método genérico para casos especiales
    makeRequest,
  };
};