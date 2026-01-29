import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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

  if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

  try {
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('court_id, time_slot_id')
      .eq('date', date);

    if (error) throw error;

    const bookedSlots = reservations.map(r => `${r.court_id}_${r.time_slot_id}`);

    return NextResponse.json({
      courts: COURTS,
      timeSlots: TIME_SLOTS,
      bookedSlots,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      courts: COURTS, 
      timeSlots: TIME_SLOTS, 
      bookedSlots: [],
      db_error: error.message 
    });
  }
}
