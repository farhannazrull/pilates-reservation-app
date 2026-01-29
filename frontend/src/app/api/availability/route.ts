import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    console.log("Fetching data from Supabase for date:", date);
    
    const courts = await sql`SELECT * FROM courts`;
    const timeSlots = await sql`SELECT * FROM time_slots`;
    
    console.log("Found courts:", courts.length);
    console.log("Found timeSlots:", timeSlots.length);

    const reservations = await sql<{ court_id: string, time_slot_id: string }[]>`
      SELECT court_id, time_slot_id FROM reservations WHERE date = ${date}
    `;

    const bookedSlots = reservations.map(r => `${r.court_id}_${r.time_slot_id}`);

    return NextResponse.json({
      courts,
      timeSlots,
      bookedSlots,
    });
  } catch (error: any) {
    console.error("DATABASE ERROR:", error.message);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
