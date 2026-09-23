const dns = require('dns');
const net = require('net');

dns.setDefaultResultOrder('ipv4first');

const host = 'ep-snowy-bird-azrf9n6j-pooler.c-3.ap-southeast-1.aws.neon.tech';
dns.lookup(host, (err, address, family) => {
  if (err) {
    console.error('Lookup error:', err);
    return;
  }
  console.log(`Lookup result: ${address} (IPv${family})`);

  console.log(`Testing TCP connect to ${address}:5432 ...`);
  const socket = new net.Socket();
  socket.setTimeout(8000);
  socket.connect(5432, address, () => {
    console.log(`🎉 SUCCESS: Connected to Neon at ${address}:5432!`);
    socket.destroy();
  });
  socket.on('timeout', () => {
    console.error(`❌ TIMEOUT connecting to ${address}:5432`);
    socket.destroy();
  });
  socket.on('error', (e) => {
    console.error(`❌ ERROR connecting to ${address}:5432:`, e.message);
    socket.destroy();
  });
});
