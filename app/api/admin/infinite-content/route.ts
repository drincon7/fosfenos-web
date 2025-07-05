// app/api/admin/infinite-content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import InfiniteContentService from '@/lib/database/infiniteContentService';
import { saveFile, validateImageFile } from '@/lib/upload';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      active: searchParams.get('active') ? searchParams.get('active') === 'true' : undefined,
      orderBy: (searchParams.get('orderBy') as any) || 'order',
      orderDirection: (searchParams.get('orderDirection') as any) || 'asc',
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '10')
    };

    const result = await InfiniteContentService.getAll(filters);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching infinite content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contenido infinito' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const description = formData.get('description') as string;
    const detailsStr = formData.get('details') as string;
    const active = formData.get('active') === 'true';
    const imageFile = formData.get('image') as File | null;

    // Validación básica
    if (!title || !shortDescription || !description) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    let details: string[] = [];
    try {
      details = JSON.parse(detailsStr || '[]');
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Formato de detalles inválido' },
        { status: 400 }
      );
    }

    // Validar y guardar imagen
    let imagePath = '';
    if (imageFile) {
      const validation = validateImageFile(imageFile);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }

      const uploadResult = await saveFile(imageFile, 'infinite-content');
      imagePath = uploadResult.url || uploadResult.path || '';
    }

    // Crear el contenido
    const data = {
      title,
      shortDescription,
      description,
      image: imagePath,
      details,
      active
    };

    const result = await InfiniteContentService.create(data);
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      message: 'Contenido creado exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating infinite content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear contenido infinito' },
      { status: 500 }
    );
  }
}