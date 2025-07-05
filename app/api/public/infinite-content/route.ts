// app/api/public/infinite-content/route.ts
import { NextResponse } from 'next/server';
import InfiniteContentService from '@/lib/database/infiniteContentService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    
    const filters = {
      search,
      active: true, // Solo contenido activo para el público
      page,
      pageSize,
      orderBy: 'order' as const,
      orderDirection: 'asc' as const
    };

    const result = await InfiniteContentService.getAll(filters);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching public infinite content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch infinite content' },
      { status: 500 }
    );
  }
}