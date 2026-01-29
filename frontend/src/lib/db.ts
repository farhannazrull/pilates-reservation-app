import postgres from 'postgres';

const getSql = () => {
  const url = process.env.DATABASE_URL || '';
  
  if (!url) {
    return ((() => []) as any);
  }

  // Coba pecah URL secara manual untuk memastikan username dengan titik terbaca benar
  try {
    const dbUrl = new URL(url);
    const username = decodeURIComponent(dbUrl.username);
    const password = decodeURIComponent(dbUrl.password);
    const host = dbUrl.hostname;
    const port = parseInt(dbUrl.port || '5432');
    const database = dbUrl.pathname.replace('/', '') || 'postgres';

    console.log("Attempting connection to host:", host, "with user:", username);

    return postgres({
      host,
      port,
      database,
      username,
      password,
      ssl: 'require',
      prepare: false, // WAJIB untuk Supabase Pooler
      connect_timeout: 10,
    });
  } catch (e) {
    // Jika gagal parsing, gunakan cara standar
    return postgres(url, {
      ssl: 'require',
      prepare: false,
      connect_timeout: 10,
    });
  }
};

const sql = getSql();
export default sql;