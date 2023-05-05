const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './text.txt');
const readStream = fs.createReadStream(filePath, 'utf8');

readStream.on('data', (string) => {
  console.log(string);
});

readStream.on('error', (err) => {
  console.error(`Error while reading file: ${err.message}`);
});