// app/api/admin/team/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TeamMemberService } from '@/lib/database';

export async function PUT(request: NextRequest) {
  try {
    const { items } = await request.json();
    await TeamMemberService.reorder(items);
    return NextResponse.json({ success: true, message: 'Orden actualizado' });
  } catch (error) {
    console.error('Error reordering team members:', error);
    return NextResponse.json(
      { success: false, error: 'Error al reordenar miembros' },
      { status: 500 }
    );
  }
}