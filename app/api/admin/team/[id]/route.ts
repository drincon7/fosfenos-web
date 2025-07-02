// app/api/admin/team/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TeamMemberService } from '@/lib/database';

// Tipos actualizados para Next.js 15
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Await params en Next.js 15
    const { id } = await context.params;
    
    const member = await TeamMemberService.getById(id);
    
    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Await params en Next.js 15
    const { id } = await context.params;
    const data = await request.json();
    
    const updatedMember = await TeamMemberService.update(id, data);
    
    return NextResponse.json({
      success: true,
      data: updatedMember
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Await params en Next.js 15
    const { id } = await context.params;
    
    await TeamMemberService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}