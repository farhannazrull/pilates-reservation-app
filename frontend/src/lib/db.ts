import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';

const sql = postgres(connectionString, {
  ssl: 'require',
  connect_timeout: 10,
  max: 1, // Batasi koneksi agar tidak kena limit Supabase Free
});

export default sql;