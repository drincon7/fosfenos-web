// app/api/admin/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ServiceService } from '@/lib/database';

export async function GET() {
  try {
    const result = await ServiceService.getAll();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await ServiceService.create(data);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear servicio' },
      { status: 500 }
    );
  }
}