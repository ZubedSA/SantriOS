const dns = require('dns');
const net = require('net');
const https = require('https');

const host = 'ep-snowy-bird-azrf9n6j-pooler.c-3.ap-southeast-1.aws.neon.tech';
const port = 5432;

console.log('=== DIAGNOSIS KONEKSI NETWORK KE NEON ===');
console.log('Host target:', host);
console.log('Port target:', port);
console.log('');

// 1. Tes DNS IPv4
dns.resolve4(host, (err, addresses) => {
  if (err) {
    console.error('❌ 1. DNS IPv4 GAGAL:', err.code, err.message);
    if (err.code === 'ENOTFOUND') {
      console.error('   👉 KEMUNGKINAN BESAR: Hostname project Neon ini sudah tidak ada / terhapus di Neon Console, atau salah ketik!');
    }
  } else {
    console.log('✅ 1. DNS IPv4 BERHASIL DITEMUKAN:', addresses);
    
    // Tes TCP Socket langsung ke IPv4 pertama
    const ip = addresses[0];
    console.log(`\n⏳ Menguji TCP handshake ke IP: ${ip}:${port} ...`);
    
    const socket = new net.Socket();
    socket.setTimeout(5000);

    socket.connect(port, ip, () => {
      console.log(`✅ 2. TCP PORT 5432 TERBUKA! Berhasil terhubung ke ${ip}:${port}`);
      socket.destroy();
    });

    socket.on('timeout', () => {
      console.error(`❌ 2. TCP TIMEOUT (5 detik)! Port 5432 diblokir oleh ISP / Firewall router Anda, atau server Neon unreachable.`);
      socket.destroy();
    });

    socket.on('error', (netErr) => {
      console.error(`❌ 2. TCP KONEKSI DITOLAK (${netErr.code}):`, netErr.message);
      socket.destroy();
    });
  }
});

// 2. Tes DNS IPv6
dns.resolve6(host, (err, addresses) => {
  if (err) {
    console.log('ℹ️  DNS IPv6: Tidak ada record AAAA / tidak didukung.');
  } else {
    console.log('ℹ️  DNS IPv6 ditemukan:', addresses);
  }
});
