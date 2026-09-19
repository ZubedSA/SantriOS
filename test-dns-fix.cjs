const dns = require('dns');
const net = require('net');

const host = 'ep-snowy-bird-azrf9n6j-pooler.c-3.ap-southeast-1.aws.neon.tech';
const port = 5432;

console.log('=== PEMERIKSAAN DNS LOKAL & PUBLIC DNS ===');
console.log('DNS Server saat ini di Windows:', dns.getServers());

// Coba gunakan Google DNS (8.8.8.8) dan Cloudflare (1.1.1.1)
console.log('\n🔄 Mencoba resolve ulang menggunakan Public DNS (8.8.8.8 & 1.1.1.1)...');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

dns.resolve4(host, (err, addresses) => {
  if (err) {
    console.error('❌ GAGAL via Public DNS juga:', err.code, err.message);
  } else {
    console.log('🎉 BERHASIL! Public DNS berhasil menemukan IP Neon:', addresses);
    
    // Tes TCP ke IP yang berhasil di-resolve
    const ip = addresses[0];
    console.log(`\n⏳ Menguji TCP koneksi ke ${ip}:${port} ...`);
    const socket = new net.Socket();
    socket.setTimeout(7000);

    socket.connect(port, ip, () => {
      console.log(`✅ KONEKSI FISIK PORT 5432 BERHASIL TERHUBUNG ke ${ip}!`);
      socket.destroy();
    });

    socket.on('timeout', () => {
      console.error(`❌ TCP Timeout ke ${ip}:${port} (Port diblokir ISP).`);
      socket.destroy();
    });

    socket.on('error', (e) => {
      console.error(`❌ TCP Error:`, e.message);
      socket.destroy();
    });
  }
});
