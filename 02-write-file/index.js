const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Введите текст или наберите "exit" для выхода');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Всего доброго!');
    writeStream.end();
    process.exit();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('Всего доброго!');
  writeStream.end();
  process.exit();
});
