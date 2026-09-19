const tls = require('tls');
const net = require('net');

const host = 'ep-snowy-bird-azrf9n6j-pooler.c-3.ap-southeast-1.aws.neon.tech';
const port = 5432;

console.log('--- Testing plain TCP to IPv4 vs IPv6 ---');
const socket = net.createConnection({ host, port }, () => {
  console.log('Plain TCP connected successfully to', socket.remoteAddress, socket.remotePort);
  
  // PostgreSQL SSL request packet: Length (8 bytes) + SSL code (80877103 in int32)
  const sslRequest = Buffer.alloc(8);
  sslRequest.writeInt32BE(8, 0);
  sslRequest.writeInt32BE(80877103, 4);
  
  console.log('Sending PostgreSQL SSLRequest...');
  socket.write(sslRequest);
  
  socket.once('data', (data) => {
    console.log('Received response byte:', data.toString(), 'hex:', data.toString('hex'));
    if (data.toString() === 'S') {
      console.log('Server replied "S" - SSL is supported! Upgrading to TLS...');
      const secureSocket = tls.connect({
        socket: socket,
        servername: host,
        rejectUnauthorized: false
      }, () => {
        console.log('TLS Handshake successful! Protocol:', secureSocket.getProtocol(), 'Cipher:', secureSocket.getCipher());
        secureSocket.end();
      });
      
      secureSocket.on('error', (e) => {
        console.error('TLS Handshake Error:', e.message, e.code);
      });
    } else {
      console.log('Server replied with unexpected byte:', data);
      socket.end();
    }
  });
});

socket.on('error', (err) => {
  console.error('Socket Error:', err.message, err.code);
});
