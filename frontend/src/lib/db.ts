import postgres from 'postgres';

// Gunakan fungsi untuk koneksi agar tidak dijalankan saat proses build Vercel
const getSql = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    // Return fungsi kosong atau dummy saat build
    return ((() => {}) as any);
  }

  return postgres(connectionString, {
    ssl: 'require',
    connect_timeout: 10,
  });
};

const sql = getSql();
export default sql;
