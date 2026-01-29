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
    const courts = await sql`SELECT id, name FROM courts`;
    const timeSlots = await sql`SELECT id, start_time as "startTime", end_time as "endTime" FROM time_slots`;
    const reservations = await sql`SELECT court_id, time_slot_id FROM reservations WHERE date = ${date}`;

    const bookedSlots = reservations.map((r: any) => `${r.court_id}_${r.time_slot_id}`);

    return NextResponse.json({
      courts,
      timeSlots,
      bookedSlots,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Database Error', details: error.message }, { status: 500 });
  }
}
