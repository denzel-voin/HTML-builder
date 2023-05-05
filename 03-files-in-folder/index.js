const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Error reading directory ${folderPath}: ${err}`);
    return;
  }
  
  // Фильтруем список файлов, оставляем только файлы
  const fileNames = files.filter(file => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    return stats.isFile();
  });
  
  // Получаем информацию о каждом файле и выводим ее в консоль
  fileNames.forEach(fileName => {
    const filePath = path.join(folderPath, fileName);
    const stats = fs.statSync(filePath);
    const extension = path.extname(fileName).slice(1);
    const fileSize = stats.size / 1024; // конвертируем в кб
    console.log(`${fileName}-${extension}-${fileSize.toFixed(3)}kb`);
  });
});