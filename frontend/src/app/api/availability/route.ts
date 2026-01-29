import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

// Jadwal tetap, tidak perlu ambil dari database lagi
const COURTS = [
  { id: 'c1', name: 'Reformer Studio A' },
  { id: 'c2', name: 'Reformer Studio B' },
  { id: 'c3', name: 'Private Suite' }
];

const TIME_SLOTS = [
  { id: 't1', startTime: '07:00', endTime: '08:00' },
  { id: 't2', startTime: '08:00', endTime: '09:00' },
  { id: 't3', startTime: '09:00', endTime: '10:00' },
  { id: 't4', startTime: '17:00', endTime: '18:00' },
  { id: 't5', startTime: '18:00', endTime: '19:00' },
  { id: 't6', startTime: '19:00', endTime: '20:00' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    // Database cuma buat ngecek mana yang sudah dibooking
    const reservations = await sql`
      SELECT court_id, time_slot_id FROM reservations WHERE date = ${date}
    `;

    const bookedSlots = reservations.map((r: any) => `${r.court_id}_${r.time_slot_id}`);

    return NextResponse.json({
      courts: COURTS,
      timeSlots: TIME_SLOTS,
      bookedSlots,
    });
  } catch (error: any) {
    console.error(error);
    // Jika database error, kita tetap kirim jam & studio tapi anggap semua kosong
    return NextResponse.json({
      courts: COURTS,
      timeSlots: TIME_SLOTS,
      bookedSlots: [],
      db_error: error.message
    });
  }
}