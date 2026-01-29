import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const body = await request.json();
  const { date, timeSlotId, courtId, userName, email } = body;

  if (!date || !timeSlotId || !courtId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    // Check if already booked
    const existing = await sql`
      SELECT id FROM reservations 
      WHERE date = ${date} AND time_slot_id = ${timeSlotId} AND court_id = ${courtId}
    `;

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });
    }

    const id = `res-${Date.now()}`;
    const reference = `PAY-${Math.floor(Date.now() / 1000)}`;

    await sql`
      INSERT INTO reservations (id, date, time_slot_id, court_id, user_name, email, status, reference, created_at)
      VALUES (${id}, ${date}, ${timeSlotId}, ${courtId}, ${userName}, ${email}, 'confirmed', ${reference}, NOW())
    `;

    return NextResponse.json({
      id,
      status: 'confirmed',
      message: 'Reservation successful!',
      reference,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
