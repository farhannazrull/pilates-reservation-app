import postgres from 'postgres';

// Fungsi untuk membersihkan string URL dari spasi atau karakter aneh
const getConnectionString = () => {
  const url = process.env.DATABASE_URL || '';
  return url.trim();
};

const sql = postgres(getConnectionString(), {
  ssl: 'require',
  connect_timeout: 10,
  prepare: false, // Penting untuk koneksi lewat Pooler (PGBouncer)
});

export default sql;
