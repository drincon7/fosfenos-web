import { useState, useEffect } from 'react';
import type { AdminService } from '@/types/service';

interface UseServicesReturn {
  data: AdminService[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useServices = (): UseServicesReturn => {
  const [data, setData] = useState<AdminService[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/public/services');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Normalizamos los datos para asegurar consistencia
        const normalizedServices: AdminService[] = (result.data || []).map((service: any) => ({
          id: service.id,
          name: service.name || service.title,
          title: service.title || service.name,
          description: service.description,
          category: service.category || 'General',
          price: service.price,
          active: service.active ?? true,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        }));
        
        setData(normalizedServices);
      } else {
        throw new Error(result.error || 'Error desconocido al cargar servicios');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar servicios';
      setError(errorMessage);
      console.error('Error in useServices:', err);
      
      // En caso de error, podemos proporcionar datos de fallback para desarrollo
      if (process.env.NODE_ENV === 'development') {
        const fallbackServices: AdminService[] = [
          {
            id: '1',
            name: 'Producción Audiovisual',
            title: 'Producción Audiovisual',
            description: 'Creación de contenido audiovisual para diferentes medios y plataformas.',
            category: 'Producción',
            price: undefined,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Consultoría Creativa',
            title: 'Consultoría Creativa',
            description: 'Asesoramiento en proyectos creativos y desarrollo de contenido.',
            category: 'Consultoría',
            price: undefined,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Formación y Talleres',
            title: 'Formación y Talleres',
            description: 'Talleres educativos y programas de formación en audiovisual.',
            category: 'Educación',
            price: 250000,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setData(fallbackServices);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchServices,
  };
};