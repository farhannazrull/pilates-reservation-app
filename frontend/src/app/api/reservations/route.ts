import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { date, timeSlotId, courtId, userName, email } = await request.json();

    // Check if already booked
    const { data: existing } = await supabase
      .from('reservations')
      .select('id')
      .match({ date, time_slot_id: timeSlotId, court_id: courtId })
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });
    }

    const id = `res-${Date.now()}`;
    const reference = `PAY-${Math.floor(Date.now() / 1000)}`;

    const { error } = await supabase
      .from('reservations')
      .insert({
        id,
        date,
        time_slot_id: timeSlotId,
        court_id: courtId,
        user_name: userName,
        email,
        status: 'confirmed',
        reference
      });

    if (error) throw error;

    return NextResponse.json({ id, status: 'confirmed', reference });
  } catch (error: any) {
    return NextResponse.json({ error: 'Database Error', details: error.message }, { status: 500 });
  }
}