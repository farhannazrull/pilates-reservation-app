import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        date,
        user_name,
        time_slots (start_time, end_time),
        courts (name)
      `)
      .order('date', { ascending: false });

    if (error) throw error;

    const results = data.map((r: any) => ({
      date: r.date,
      time: `${r.time_slots?.start_time} - ${r.time_slots?.end_time}`,
      studio: r.courts?.name,
      userName: r.user_name
    }));

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}