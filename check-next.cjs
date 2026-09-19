const fs = require('fs');
const path = require('path');

const p = path.resolve('node_modules/next');
console.log('Path:', p);
if (fs.existsSync(p)) {
  const stat = fs.lstatSync(p);
  console.log('Is directory?', stat.isDirectory());
  console.log('Is symlink?', stat.isSymbolicLink());
  console.log('Is file?', stat.isFile());
  if (stat.isSymbolicLink()) {
    console.log('Target:', fs.readlinkSync(p));
  }
} else {
  console.log('Not found!');
}
