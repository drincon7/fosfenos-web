// types/admin.ts
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember extends BaseEntity {
  nombre: string;
  cargo: string;
  imagen?: string;
  imagenDark?: string;
  active: boolean;
  order: number;
}

export interface Brand extends BaseEntity {
  name: string;
  href?: string;
  image: string;
  imageLight: string;
  active: boolean;
  order: number;
}

export interface ChildContent extends BaseEntity {
  title: string;
  slug: string;
  synopsis: string;
  format: string;
  duration: string;
  status: string;
  posterImage: string;
  published: boolean;
  order: number;
}

export interface Service extends BaseEntity {
  title: string;
  description: string;
  icon: string;
  active: boolean;
  order: number;
}

// Tipos para formularios
export interface CreateTeamMemberForm {
  nombre: string;
  cargo: string;
  imagen?: File | null;
  imagenDark?: File | null;
  active: boolean;
}

export interface CreateBrandForm {
  name: string;
  href?: string;
  image?: File | null;
  imageLight?: File | null;
  active: boolean;
}

export interface CreateChildContentForm {
  title: string;
  slug: string;
  synopsis: string;
  format: string;
  duration: string;
  status: string;
  posterImage?: File | null;
  published: boolean;
}

export interface CreateServiceForm {
  title: string;
  description: string;
  icon: string;
  active: boolean;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Tipos para filtros
export interface BaseFilters {
  search?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface TeamFilters extends BaseFilters {
  cargo?: string;
}

export interface ContentFilters extends BaseFilters {
  published?: boolean;
  format?: string;
  status?: string;
}

// Tipos para la subida de archivos
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}