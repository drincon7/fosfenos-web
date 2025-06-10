import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Aquí puedes añadir lógica adicional de middleware
    console.log('Accessing protected route:', req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Permitir acceso a la página de login
        if (pathname === '/admin/login') {
          return true;
        }
        
        // Requerir autenticación para todas las rutas de admin
        if (pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN';
        }
        
        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/admin/:path*']
};