import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const results = await sql`
      SELECT 
        r.date, 
        ts.start_time || ' - ' || ts.end_time as time, 
        c.name as studio, 
        r.user_name as "userName"
      FROM reservations r
      LEFT JOIN time_slots ts ON ts.id = r.time_slot_id
      LEFT JOIN courts c ON c.id = r.court_id
      ORDER BY r.date DESC
    `;

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
