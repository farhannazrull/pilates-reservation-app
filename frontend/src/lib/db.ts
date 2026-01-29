import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';

// Gunakan singleton agar tidak terlalu banyak koneksi ke Supabase
const sql = postgres(connectionString, {
  ssl: 'require',
  connect_timeout: 10,
  max: 10, // Maksimal koneksi
  idle_timeout: 20,
});

export default sql;
