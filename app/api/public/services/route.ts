import { NextResponse } from 'next/server';
import { ServiceService } from '@/lib/database';

export async function GET() {
  try {
    const services = await ServiceService.getAll();
    
    return NextResponse.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}