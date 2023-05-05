const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(distDir, 'bundle.css');

// Чтение содержимого папки styles
fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Фильтрация только файлов с расширением css
  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  // Создание массива из содержимого файлов
  const styles = cssFiles.map((file) =>
    fs.readFileSync(path.join(stylesDir, file))
  );

  // Запись массива стилей в файл bundle.css
  fs.writeFileSync(outputFile, styles.join(''), (err) => {
    if (err) {
      console.error(err);
    }
  });
});
