// app/api/admin/child-content/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ChildContentService } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await ChildContentService.getById(params.id);
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Contenido no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching child content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const result = await ChildContentService.update(params.id, data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating child content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar contenido' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ChildContentService.delete(params.id);
    return NextResponse.json({ success: true, message: 'Contenido eliminado' });
  } catch (error) {
    console.error('Error deleting child content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar contenido' },
      { status: 500 }
    );
  }
}