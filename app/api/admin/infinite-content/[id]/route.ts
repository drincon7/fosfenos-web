// app/api/admin/infinite-content/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import InfiniteContentService from '@/lib/database/infiniteContentService';
import { saveFile, validateImageFile } from '@/lib/upload';

// Tipos actualizados para Next.js 15
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    
    const result = await InfiniteContentService.getById(id);
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Contenido no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching infinite content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    
    const updateData: any = {};

    // Obtener campos del formulario
    const title = formData.get('title') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const description = formData.get('description') as string;
    const detailsStr = formData.get('details') as string;
    const active = formData.get('active');
    const imageFile = formData.get('image') as File | null;

    // Actualizar solo los campos proporcionados
    if (title) updateData.title = title;
    if (shortDescription) updateData.shortDescription = shortDescription;
    if (description) updateData.description = description;
    if (active !== null) updateData.active = active === 'true';

    // Procesar detalles
    if (detailsStr) {
      try {
        updateData.details = JSON.parse(detailsStr);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Formato de detalles inválido' },
          { status: 400 }
        );
      }
    }

    // Procesar imagen si se proporciona
    if (imageFile && imageFile.size > 0) {
      const validation = validateImageFile(imageFile);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }

      const uploadResult = await saveFile(imageFile, 'infinite-content');
      updateData.image = uploadResult.url || uploadResult.path || '';
    }

    const result = await InfiniteContentService.update(id, updateData);
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      message: 'Contenido actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating infinite content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar contenido' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    
    await InfiniteContentService.delete(id);
    return NextResponse.json({ 
      success: true, 
      message: 'Contenido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting infinite content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar contenido' },
      { status: 500 }
    );
  }
}