const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Simple .env parser without external dependencies
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

async function testConnection(label, url) {
  console.log(`\n--- Menguji Koneksi [${label}] ---`);
  const masked = url ? url.replace(/:[^:@]+@/, ':***@') : 'TIDAK DITEMUKAN';
  console.log('Target URL:', masked);

  const prisma = new PrismaClient({
    datasources: {
      db: { url },
    },
  });

  try {
    const res = await prisma.$queryRawUnsafe('SELECT version() as pg_version, current_database() as db_name, now() as current_time');
    console.log('✅ BERHASIL TERKONEKSI KE NEON POSTGRESQL!');
    console.log('Detail server:', res);
    return true;
  } catch (err) {
    console.error('❌ GAGAL TERHUBUNG:', err.message || err);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const origDbUrl = process.env.DATABASE_URL;
  const directDbUrl = process.env.DIRECT_URL;

  console.log('=== SANTRIOS NEON CONNECTION DIAGNOSTIC ===');
  
  if (!origDbUrl) {
    console.error('ERROR: DATABASE_URL tidak ditemukan di file .env');
    return;
  }

  // Tes 1: URL asli dari .env
  await testConnection('DATABASE_URL (Asli)', origDbUrl);

  // Tes 2: URL tanpa channel_binding jika ada
  if (origDbUrl.includes('channel_binding=')) {
    const cleanUrl = origDbUrl.replace(/&channel_binding=[^&]+/, '').replace(/\?channel_binding=[^&]+&?/, '?');
    await testConnection('DATABASE_URL (Tanpa channel_binding)', cleanUrl);
  }

  // Tes 3: DIRECT_URL tanpa channel_binding
  if (directDbUrl) {
    const cleanDirect = directDbUrl.replace(/&channel_binding=[^&]+/, '').replace(/\?channel_binding=[^&]+&?/, '?');
    await testConnection('DIRECT_URL (Direct Compute)', cleanDirect);
  }
}

main();
