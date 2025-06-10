// lib/auth.ts (CREAR O REEMPLAZAR)
import { NextRequest } from 'next/server';

// Interfaces básicas
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface Session {
  user: User;
  expires: string;
}

// Mock de usuario admin para desarrollo
const mockAdminUser: User = {
  id: '1',
  email: 'admin@fosfenosmedia.com',
  name: 'Administrador',
  role: 'ADMIN'
};

// Función temporal para simular sesión
export async function getSession(): Promise<Session | null> {
  // TODO: Reemplazar con getServerSession de NextAuth cuando esté configurado
  return {
    user: mockAdminUser,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
}

// Función para requerir autenticación de admin
export async function requireAdminAuth(): Promise<User> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('No autorizado - Sesión requerida');
  }

  if (session.user.role !== 'ADMIN') {
    throw new Error('No autorizado - Permisos de administrador requeridos');
  }

  return session.user;
}

// Función para verificar si el usuario está autenticado
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession();
    return !!session;
  } catch {
    return false;
  }
}

// Función para verificar si el usuario es admin
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getSession();
    return session?.user.role === 'ADMIN' || false;
  } catch {
    return false;
  }
}

// Middleware para proteger rutas (para usar cuando tengamos NextAuth)
export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      await requireAdminAuth();
      return handler(request, ...args);
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error instanceof Error ? error.message : 'No autorizado' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

// Utilidades adicionales
export function hashPassword(password: string): string {
  // TODO: Implementar con bcrypt cuando se configure
  return password; // Temporalmente retorna la contraseña sin hash
}

export function comparePassword(password: string, hash: string): boolean {
  // TODO: Implementar con bcrypt cuando se configure
  return password === hash; // Temporalmente compara directamente
}