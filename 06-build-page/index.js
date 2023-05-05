const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, './components');
const STYLES_DIR = path.join(__dirname, './styles');
const ASSETS_DIR = path.join(__dirname, './assets');
const TEMPLATE_FILE = path.join(__dirname, './template.html');
const DIST_DIR = path.join(__dirname, './project-dist');
const INDEX_FILE = path.join(DIST_DIR, './index.html');
const STYLE_FILE = path.join(DIST_DIR, './style.css');

function main() {
  // Создание директории project-dist
  fs.mkdir(DIST_DIR, { recursive: true }, (err) => {
    if (err) {
      console.error(`Failed to create directory ${DIST_DIR}: ${err}`);
      return;
    }

    // Замена шаблонных тегов в файле template.html
    fs.readFile(TEMPLATE_FILE, 'utf8', (err, template) => {
      if (err) {
        console.error(`Failed to read template file ${TEMPLATE_FILE}: ${err}`);
        return;
      }

      replaceTemplateTags(template, (err, result) => {
        if (err) {
          console.error(`Failed to replace template tags: ${err}`);
          return;
        }

        // Запись результата в файл index.html
        fs.writeFile(INDEX_FILE, result, (err) => {
          if (err) {
            console.error(`Failed to write index file ${INDEX_FILE}: ${err}`);
            return;
          }
          console.log(`File ${INDEX_FILE} written successfully`);
        });
      });
    });

    // Сборка стилей в файл style.css
    buildStyleFile((err, result) => {
      if (err) {
        console.error(`Failed to build style file: ${err}`);
        return;
      }

      // Запись результата в файл style.css
      fs.writeFile(STYLE_FILE, result, (err) => {
        if (err) {
          console.error(`Failed to write style file ${STYLE_FILE}: ${err}`);
          return;
        }
        console.log(`File ${STYLE_FILE} written successfully`);
      });
    });

    // Копирование папки assets
    copyAssetsDirectory((err) => {
      if (err) {
        console.error(`Failed to copy assets directory: ${err}`);
        return;
      }
      console.log(`Directory ${ASSETS_DIR} copied successfully`);
    });
  });
}

// Функция для замены тегов в шаблоне
function replaceTemplateTags(template, callback) {
  const tags = template.match(/\{\{(\w+)\}\}/g);
  if (!tags) {
    callback(null, template);
    return;
  }

  // Считываем содержимое каждого компонента и заменяем соответствующий тег
  let result = template;
  let remaining = tags.length;
  tags.forEach((tag) => {
    const componentName = tag.slice(2, -2);
    const componentFile = path.join(COMPONENTS_DIR, `${componentName}.html`);
    fs.readFile(componentFile, 'utf8', (err, componentContent) => {
      if (err) {
        callback(err);
        return;
      }

      result = result.replace(tag, componentContent);
      remaining--;
      if (remaining === 0) {
        callback(null, result);
      }
    });
  });
}

// Функция для сборки всех файлов стилей в один файл
function buildStyleFile(callback) {
  // Получаем список файлов стилей
  fs.readdir(STYLES_DIR, (err, files) => {
  if (err) {
  callback(err);
  return;
  }
  // Фильтруем только файлы с расширением .css
const cssFiles = files.filter((file) => path.extname(file) === '.css');

// Считываем содержимое каждого файла и объединяем в одну строку
let result = '';
let remaining = cssFiles.length;
cssFiles.forEach((file) => {
  const filePath = path.join(STYLES_DIR, file);
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      callback(err);
      return;
    }

    result += content;
    remaining--;
    if (remaining === 0) {
      callback(null, result);
    }
  });
});
});
}
//Копируем папку assets
function copyAssetsDirectory(callback) {
  const targetDir = path.join(DIST_DIR, 'assets');
  fs.mkdir(targetDir, { recursive: true }, (err) => {
    if (err) {
      callback(err);
      return;
    }
    fs.readdir(ASSETS_DIR, { withFileTypes: true }, (err, files) => {
      if (err) {
        callback(err);
        return;
      }
      let remaining = files.length;
      if (!remaining) {
        callback(null);
        return;
      }
      for (const file of files) {
        const source = path.join(ASSETS_DIR, file.name);
        const dest = path.join(targetDir, file.name);
        if (file.isDirectory()) {
          fs.mkdir(dest, { recursive: true }, (err) => {
            if (err) {
              callback(err);
              return;
            }
            copyDirectory(source, dest, (err) => {
              if (err) {
                callback(err);
                return;
              }
              if (--remaining === 0) {
                callback(null);
              }
            });
          });
        } else {
          fs.copyFile(source, dest, (err) => {
            if (err) {
              callback(err);
              return;
            }
            if (--remaining === 0) {
              callback(null);
            }
          });
        }
      }
    });
  });
}
//Копируем директорию
function copyDirectory(source, dest, callback) {
  fs.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) {
      callback(err);
      return;
    }
    let remaining = files.length;
    if (!remaining) {
      callback(null);
      return;
    }
    for (const file of files) {
      const srcPath = path.join(source, file.name);
      const destPath = path.join(dest, file.name);
      if (file.isDirectory()) {
        fs.mkdir(destPath, { recursive: true }, (err) => {
          if (err) {
            callback(err);
            return;
          }
          copyDirectory(srcPath, destPath, (err) => {
            if (err) {
              callback(err);
              return;
            }
            if (--remaining === 0) {
              callback(null);
            }
          });
        });
      } else {
        fs.copyFile(srcPath, destPath, (err) => {
          if (err) {
            callback(err);
            return;
          }
          if (--remaining === 0) {
            callback(null);
          }
        });
      }
    }
  });
}

main();