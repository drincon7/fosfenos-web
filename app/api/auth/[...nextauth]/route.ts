// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// Crear el handler de NextAuth
const handler = NextAuth(authOptions);

// Exportar solo los métodos HTTP como requiere Next.js 15
export { handler as GET, handler as POST };