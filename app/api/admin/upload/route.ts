// app/api/admin/upload/route.ts (CREAR NUEVO ARCHIVO)
import { NextRequest, NextResponse } from 'next/server';
import { saveFile, validateImageFile } from '@/lib/upload';

// Función simple de autenticación
async function requireAdminAuth() {
  return true;
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se ha enviado ningún archivo' },
        { status: 400 }
      );
    }

    // Validar archivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Guardar archivo
    const result = await saveFile(file, folder);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Archivo subido correctamente'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al subir el archivo' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener información de archivos (opcional)
export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'uploads';

    // TODO: Implementar listado de archivos si es necesario
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Endpoint para listar archivos - por implementar'
    });

  } catch (error) {
    console.error('Upload GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener archivos' },
      { status: 500 }
    );
  }
}