import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';

const sql = postgres(connectionString, {
  ssl: connectionString.includes('supabase') ? 'require' : false,
  // Menghindari error saat build jika env var belum ada
  connect_timeout: 10,
});

export default sql;