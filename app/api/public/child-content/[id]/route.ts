// app/api/public/child-content/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ChildContentService } from '@/lib/database';

// Tipos actualizados para Next.js 15
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Await params en Next.js 15
    const { id } = await context.params;
    
    // Primero intentar buscar por ID
    let content = await ChildContentService.getById(id);
    
    // Si no se encuentra por ID y parece ser un slug (contiene guiones o letras)
    // intentar buscar por slug como fallback
    if (!content && isNaN(Number(id))) {
      content = await ChildContentService.getBySlug(id);
    }
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

/*
Este endpoint soporta tanto IDs como slugs:
- GET /api/public/child-content/123 (busca por ID)
- GET /api/public/child-content/el-libro-de-lila (busca por slug como fallback)
*/