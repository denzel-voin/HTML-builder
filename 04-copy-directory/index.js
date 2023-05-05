const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const filesDir = path.join(__dirname, 'files');
  const filesCopyDir = path.join(__dirname, 'files-copy');

  try {
    await fs.access(filesCopyDir);
  } catch (err) {
    // Если папки не существует, создаем ее
    if (err.code === 'ENOENT') {
      await fs.mkdir(filesCopyDir);
    } else {
      throw err;
    }
  }

  const files = await fs.readdir(filesDir);

  for (const file of files) {
    const currentFilePath = path.join(filesDir, file);
    const currentFileCopyPath = path.join(filesCopyDir, file);
    const stats = await fs.stat(currentFilePath);

    if (stats.isFile()) {
      await fs.copyFile(currentFilePath, currentFileCopyPath);
    }
  }
}

copyDir().catch((err) => console.error(err));
