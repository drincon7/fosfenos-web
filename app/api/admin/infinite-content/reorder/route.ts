// app/api/admin/infinite-content/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import InfiniteContentService from '@/lib/database/infiniteContentService';

export async function PUT(request: NextRequest) {
  try {
    const { items } = await request.json();
    
    // Validar que items es un array
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Items debe ser un array' },
        { status: 400 }
      );
    }

    // Validar que cada item tiene id y order
    for (const item of items) {
      if (!item.id || typeof item.order !== 'number') {
        return NextResponse.json(
          { success: false, error: 'Cada elemento debe tener id y order válidos' },
          { status: 400 }
        );
      }
    }

    await InfiniteContentService.reorder(items);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Orden actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error reordering infinite content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al reordenar contenido' },
      { status: 500 }
    );
  }
}