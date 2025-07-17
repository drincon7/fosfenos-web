// app/api/admin/infinite-content/[id]/move-up/route.ts
import { NextRequest, NextResponse } from 'next/server';
import InfiniteContentService from '@/lib/database/infiniteContentService';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    
    const result = await InfiniteContentService.moveUp(id);
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      message: 'Elemento movido hacia arriba exitosamente'
    });
  } catch (error) {
    console.error('Error moving item up:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Error al mover elemento' },
      { status: 500 }
    );
  }
}