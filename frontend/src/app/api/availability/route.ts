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
    // Debug: Cek apakah env var terbaca (tanpa membocorkan password)
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL is missing in Vercel settings' }, { status: 500 });
    }

    const courts = await sql`SELECT * FROM courts`;
    const timeSlots = await sql`SELECT * FROM time_slots`;
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
    // Menampilkan detail error asli dari Postgres/Supabase
    return NextResponse.json({ 
      error: 'Database Connection Error', 
      details: error.message,
      hint: error.hint 
    }, { status: 500 });
  }
}