import { NextResponse } from 'next/server';
import { ChildContentService } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const content = await ChildContentService.getBySlug(params.slug);
    
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
    console.error('Error fetching content by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
