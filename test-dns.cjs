const dns = require('dns');

dns.lookup('ep-snowy-bird-azrf9n6j-pooler.c-3.ap-southeast-1.aws.neon.tech', (err, address, family) => {
  if (err) {
    console.error('dns.lookup failed:', err.message);
  } else {
    console.log('dns.lookup address:', address, 'family:', family);
  }
});

dns.lookup('google.com', (err, address, family) => {
  if (err) {
    console.error('google.com lookup failed:', err.message);
  } else {
    console.log('google.com lookup address:', address);
  }
});
