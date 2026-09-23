try {
  const { Client } = require('pg');
  console.log('pg is installed');
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_v6wUIGxP5bcX@ep-snowy-bird-azrf9n6j-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false }
  });
  client.connect()
    .then(() => {
      console.log('✅ PG CONNECTED TO NEON!');
      return client.query('SELECT 1 as num, now() as t');
    })
    .then((r) => {
      console.log('✅ QUERY RESULT:', r.rows);
      return client.end();
    })
    .catch((err) => {
      console.error('❌ PG ERROR:', err);
      process.exit(1);
    });
} catch (e) {
  console.log('pg is not installed:', e.message);
}
