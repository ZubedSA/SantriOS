const { PrismaClient } = require('@prisma/client');

// Connect to Neon directly via IPv4 IP with endpoint parameter
const ipUrl = "postgresql://neondb_owner:npg_v6wUIGxP5bcX@13.251.213.89:5432/neondb?sslmode=require&options=endpoint%3Dep-snowy-bird-azrf9n6j-pooler&connect_timeout=30";

async function main() {
  console.log('Testing connection to Neon via direct IPv4 address 13.251.213.89 ...');
  const prisma = new PrismaClient({
    datasources: { db: { url: ipUrl } },
    log: ['query', 'error', 'warn']
  });

  try {
    const res = await prisma.$queryRaw`SELECT 1 as result, now() as current_time`;
    console.log('🎉 SUCCESS CONNECTED TO NEON POSTGRESQL VIA IPV4:', res);
  } catch (err) {
    console.error('❌ Error connecting via IPv4:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
