// types/infiniteContent.ts
export interface InfiniteContentItem {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  details: string[]; // Siempre será string[] después de la conversión
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInfiniteContentData {
  title: string;
  shortDescription: string;
  description: string;
  image?: File | string; // Puede ser un archivo o una URL
  details: string[]; // Siempre es array, no opcional
  active: boolean;
}

export interface UpdateInfiniteContentData extends Partial<CreateInfiniteContentData> {
  id?: string;
}

export interface InfiniteContentFilters {
  search?: string;
  active?: boolean;
  orderBy?: 'order' | 'title' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface InfiniteContentResponse {
  data: InfiniteContentItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Tipos para el grid visual (mantiene compatibilidad con el componente actual)
export interface GridItem extends InfiniteContentItem {
  size: 'small' | 'medium' | 'large';
  aspectRatio: string;
}

// Tipos para formularios
export interface InfiniteContentFormData {
  title: string;
  shortDescription: string;
  description: string;
  details: string[];
  active: boolean;
  image?: File | null;
  currentImageUrl?: string;
}

// Tipos para validación
export interface InfiniteContentValidationErrors {
  title?: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  details?: string;
  submit?: string;
}

// Tipos para APIs
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Constantes para validación
export const INFINITE_CONTENT_CONSTANTS = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  SHORT_DESCRIPTION_MIN_LENGTH: 10,
  SHORT_DESCRIPTION_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 20,
  DESCRIPTION_MAX_LENGTH: 2000,
  MAX_DETAILS: 20,
  DETAIL_MAX_LENGTH: 200,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const;

// Helper para validación
export const validateInfiniteContentData = (data: Partial<CreateInfiniteContentData>): InfiniteContentValidationErrors => {
  const errors: InfiniteContentValidationErrors = {};

  // Validar título
  if (!data.title) {
    errors.title = 'El título es requerido';
  } else if (data.title.length < INFINITE_CONTENT_CONSTANTS.TITLE_MIN_LENGTH) {
    errors.title = `El título debe tener al menos ${INFINITE_CONTENT_CONSTANTS.TITLE_MIN_LENGTH} caracteres`;
  } else if (data.title.length > INFINITE_CONTENT_CONSTANTS.TITLE_MAX_LENGTH) {
    errors.title = `El título no puede exceder ${INFINITE_CONTENT_CONSTANTS.TITLE_MAX_LENGTH} caracteres`;
  }

  // Validar descripción corta
  if (!data.shortDescription) {
    errors.shortDescription = 'La descripción corta es requerida';
  } else if (data.shortDescription.length < INFINITE_CONTENT_CONSTANTS.SHORT_DESCRIPTION_MIN_LENGTH) {
    errors.shortDescription = `La descripción corta debe tener al menos ${INFINITE_CONTENT_CONSTANTS.SHORT_DESCRIPTION_MIN_LENGTH} caracteres`;
  } else if (data.shortDescription.length > INFINITE_CONTENT_CONSTANTS.SHORT_DESCRIPTION_MAX_LENGTH) {
    errors.shortDescription = `La descripción corta no puede exceder ${INFINITE_CONTENT_CONSTANTS.SHORT_DESCRIPTION_MAX_LENGTH} caracteres`;
  }

  // Validar descripción
  if (!data.description) {
    errors.description = 'La descripción es requerida';
  } else if (data.description.length < INFINITE_CONTENT_CONSTANTS.DESCRIPTION_MIN_LENGTH) {
    errors.description = `La descripción debe tener al menos ${INFINITE_CONTENT_CONSTANTS.DESCRIPTION_MIN_LENGTH} caracteres`;
  } else if (data.description.length > INFINITE_CONTENT_CONSTANTS.DESCRIPTION_MAX_LENGTH) {
    errors.description = `La descripción no puede exceder ${INFINITE_CONTENT_CONSTANTS.DESCRIPTION_MAX_LENGTH} caracteres`;
  }

  // Validar detalles
  if (data.details && data.details.length > INFINITE_CONTENT_CONSTANTS.MAX_DETAILS) {
    errors.details = `No puede haber más de ${INFINITE_CONTENT_CONSTANTS.MAX_DETAILS} detalles`;
  } else if (data.details) {
    const invalidDetail = data.details.find(detail => detail.length > INFINITE_CONTENT_CONSTANTS.DETAIL_MAX_LENGTH);
    if (invalidDetail) {
      errors.details = `Cada detalle no puede exceder ${INFINITE_CONTENT_CONSTANTS.DETAIL_MAX_LENGTH} caracteres`;
    }
  }

  // Validar imagen (solo si es un archivo)
  if (data.image instanceof File) {
    if (data.image.size > INFINITE_CONTENT_CONSTANTS.IMAGE_MAX_SIZE) {
      errors.image = `La imagen no puede exceder ${INFINITE_CONTENT_CONSTANTS.IMAGE_MAX_SIZE / (1024 * 1024)}MB`;
    }
    if (!INFINITE_CONTENT_CONSTANTS.SUPPORTED_IMAGE_TYPES.includes(data.image.type as any)) {
      errors.image = 'Solo se permiten imágenes JPG, PNG y WebP';
    }
  }

  return errors;
};

// Helper para generar orden automático
export const getNextOrder = (items: InfiniteContentItem[]): number => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.order)) + 1;
};

// Helper para generar slug único
export const generateSlug = (title: string, existingItems: InfiniteContentItem[] = []): string => {
  const baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-'); // Remover guiones duplicados

  // Verificar si el slug ya existe
  const existingSlugs = existingItems.map(item => 
    item.title.toLowerCase().replace(/\s+/g, '-')
  );

  let finalSlug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
};