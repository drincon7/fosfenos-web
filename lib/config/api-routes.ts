// lib/config/api-routes.ts

// Base URLs
const API_BASE = '/api';
const ADMIN_BASE = `${API_BASE}/admin`;
const PUBLIC_BASE = `${API_BASE}/public`;

// Rutas de autenticación
export const authRoutes = {
  signIn: `${API_BASE}/auth/signin`,
  signOut: `${API_BASE}/auth/signout`,
  session: `${API_BASE}/auth/session`,
} as const;

// Rutas administrativas
export const adminRoutes = {
  // Team management
  team: {
    base: `${ADMIN_BASE}/team`,
    byId: (id: string) => `${ADMIN_BASE}/team/${id}`,
    reorder: `${ADMIN_BASE}/team/reorder`,
  },

  // Brand management
  brands: {
    base: `${ADMIN_BASE}/brands`,
    byId: (id: string) => `${ADMIN_BASE}/brands/${id}`,
  },

  // Child content management
  childContent: {
    base: `${ADMIN_BASE}/child-content`,
    byId: (id: string) => `${ADMIN_BASE}/child-content/${id}`,
  },

  // Services management
  services: {
    base: `${ADMIN_BASE}/services`,
    byId: (id: string) => `${ADMIN_BASE}/services/${id}`,
  },

  // File upload
  upload: `${ADMIN_BASE}/upload`,
} as const;

// Rutas públicas
export const publicRoutes = {
  // Team
  team: `${PUBLIC_BASE}/team`,

  // Brands
  brands: `${PUBLIC_BASE}/brands`,

  // Child content
  childContent: {
    base: `${PUBLIC_BASE}/child-content`,
    bySlug: (slug: string) => `${PUBLIC_BASE}/child-content/${slug}`,
  },

  // Services
  services: `${PUBLIC_BASE}/services`,
} as const;

// Helper para construir URLs con query parameters
export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Helper para validar rutas
export const isValidRoute = (route: string): boolean => {
  try {
    new URL(route, 'http://localhost');
    return true;
  } catch {
    return false;
  }
};

// Constantes para códigos de estado HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Tipos para las respuestas de API
export type ApiRoutes = typeof adminRoutes | typeof publicRoutes;
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];