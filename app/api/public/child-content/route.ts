import { NextResponse } from 'next/server';
import { ChildContentService } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const published = searchParams.get('published');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const orderBy = searchParams.get('orderBy') as any || 'order';
    const orderDirection = searchParams.get('orderDirection') as any || 'asc';
    
    const filters = {
      search,
      published: published ? published === 'true' : undefined,
      page,
      pageSize,
      orderBy,
      orderDirection
    };

    const result = await ChildContentService.getAll(filters);
    
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
    console.error('Error fetching child content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch child content' },
      { status: 500 }
    );
  }
}