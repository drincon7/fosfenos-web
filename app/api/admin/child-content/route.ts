// app/api/admin/child-content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ChildContentService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      published: searchParams.get('published') ? searchParams.get('published') === 'true' : undefined,
      orderBy: (searchParams.get('orderBy') as any) || 'order',
      orderDirection: (searchParams.get('orderDirection') as any) || 'asc',
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '10')
    };

    const result = await ChildContentService.getAll(filters);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching child content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contenido infantil' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await ChildContentService.create(data);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating child content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear contenido infantil' },
      { status: 500 }
    );
  }
}