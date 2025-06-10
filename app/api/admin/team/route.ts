import { NextResponse } from 'next/server';
import { TeamMemberService } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || undefined;
    
    const result = await TeamMemberService.getAll({
      page,
      pageSize,
      search,
      active: true // Solo miembros activos por defecto en admin
    });
    
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error in admin team API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newMember = await TeamMemberService.create(data);
    
    return NextResponse.json({
      success: true,
      data: newMember
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
