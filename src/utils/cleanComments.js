#!/usr/bin/env node
/**
 * Скрипт для удаления комментариев из JavaScript файлов
 * Удаляет:
 * 1. Комментарии в фигурных скобках { }
 * 2. Однострочные комментарии, начинающиеся с 
 * 
 * Использование:
 * node cleanComments.js [опции]
 * 
 * Опции:
 *   --dry-run       Только показать, какие файлы будут изменены, без реального изменения
 *   --path=<путь>   Указать конкретный путь для обработки (по умолчанию: ../src)
 *   --backup        Создать .bak файлы перед изменением
 *   --help          Показать это сообщение
 */
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  backup: args.includes('--backup'),
  help: args.includes('--help'),
  path: '../'
};
args.forEach(arg => {
  if (arg.startsWith('--path=')) {
    options.path = arg.split('=')[1];
  }
});
if (options.help) {
  const helpText = `
Скрипт для удаления комментариев из JavaScript файлов
Удаляет:
1. Комментарии в фигурных скобках { }
2. Однострочные комментарии, начинающиеся с 
Использование:
node cleanComments.js [опции]
Опции:
  --dry-run       Только показать, какие файлы будут изменены, без реального изменения
  --path=<путь>   Указать конкретный путь для обработки (по умолчанию: ../src)
  --backup        Создать .bak файлы перед изменением
  --help          Показать это сообщение
  `;
  console.log(helpText);
  process.exit(0);
}
const targetDir = path.resolve(__dirname, options.path);
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const stats = {
  processed: 0,
  modified: 0,
  errors: 0,
  bytesRemoved: 0
};
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walkDir(filePath, callback);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      if (extensions.includes(ext)) {
        callback(filePath);
      }
    }
  });
}
function removeComments(filePath) {
  console.log(`Обработка файла: ${filePath}`);
  stats.processed++;
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalSize = content.length;
    let noComments = content;
    noComments = removeStandardComments(noComments);
    noComments = removeBraceComments(noComments);
    noComments = noComments.replace(/^\s*[\r\n]/gm, '');
    if (noComments.length < originalSize) {
      const bytesRemoved = originalSize - noComments.length;
      stats.bytesRemoved += bytesRemoved;
      stats.modified++;
      console.log(`  Найдены комментарии для удаления: ${bytesRemoved} байт`);
      if (!options.dryRun) {
        if (options.backup) {
          fs.writeFileSync(`${filePath}.bak`, content, 'utf8');
          console.log(`  Создана резервная копия: ${filePath}.bak`);
        }
        fs.writeFileSync(filePath, noComments, 'utf8');
        console.log(`  Файл обновлен`);
      } else {
        console.log(`  [Режим просмотра] Файл не изменен`);
      }
    } else {
      console.log('  Комментарии не найдены');
    }
  } catch (err) {
    console.error(`Ошибка при обработке файла ${filePath}: ${err.message}`);
    stats.errors++;
  }
}
function removeStandardComments(content) {
  return content.replace(/\/\/.*$/gm, '');
}
function removeBraceComments(content) {
  return content.replace(/^\s*\{([^{}]*)\}\s*$/gm, (match, inside) => {
    if (!/function|return|const|let|var|if|else|for|while|class|switch|case|break|import|export/.test(inside)) {
      return '';
    }
    return match;
  });
}
function main() {
  console.log(`Начинаем поиск и удаление комментариев в ${targetDir}...`);
  if (options.dryRun) {
    console.log('РЕЖИМ ПРОСМОТРА: Файлы не будут изменены');
  }
  walkDir(targetDir, (filePath) => {
    removeComments(filePath);
  });
  console.log('\nСтатистика обработки:');
  console.log(`Проверено файлов: ${stats.processed}`);
  console.log(`Модифицировано файлов: ${stats.modified}`);
  console.log(`Удалено байт: ${stats.bytesRemoved}`);
  console.log(`Ошибок: ${stats.errors}`);
  if (options.dryRun && stats.modified > 0) {
    console.log('\nДля применения изменений запустите скрипт без опции --dry-run');
  }
}
main(); 