const { PrismaClient } = require('@prisma/client');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const poolerUrl = "postgresql://neondb_owner:npg_v6wUIGxP5bcX@ep-snowy-bird-azrf9n6j-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=30";
const directUrl = "postgresql://neondb_owner:npg_v6wUIGxP5bcX@ep-snowy-bird-azrf9n6j.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30";

async function test(name, url) {
  console.log(`Testing ${name} ...`);
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    const start = Date.now();
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log(`✅ ${name} SUCCESS in ${Date.now() - start}ms:`, result);
  } catch (e) {
    console.error(`❌ ${name} FAILED:`, e.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await test('POOLER', poolerUrl);
  await test('DIRECT', directUrl);
}

main();
