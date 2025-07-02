// types/service.ts

// Tipo base para un servicio
export interface BaseService {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo extendido para la administración
export interface AdminService extends BaseService {
  title?: string; // Alias para name, para compatibilidad
  category?: string;
  price?: number;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  metadata?: Record<string, any>;
}

// Tipo para la API pública
export interface PublicService extends BaseService {
  category?: string;
  featured?: boolean;
  order?: number;
}

// Tipo para formularios de creación/edición
export interface ServiceFormData {
  name: string;
  description?: string;
  category?: string;
  price?: number;
  active?: boolean;
  tags?: string[];
}

// Tipo para filtros de servicios
export interface ServiceFilters {
  category?: string;
  active?: boolean;
  search?: string;
  featured?: boolean;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

// Tipo para la respuesta de la API
export interface ServiceResponse {
  success: boolean;
  data?: AdminService[];
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Enum para categorías de servicios
export enum ServiceCategory {
  PRODUCTION = 'Producción',
  CONSULTING = 'Consultoría', 
  EDUCATION = 'Educación',
  DEVELOPMENT = 'Desarrollo',
  DESIGN = 'Diseño',
  OTHER = 'Otros'
}

// Tipo para estadísticas de servicios
export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
  byCategory: Record<string, number>;
  featured: number;
}