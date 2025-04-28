const fs = require('fs');
const path = require('path');

// Set current folder (already inside /frontend)
const baseDir = __dirname;

// Extensions
const oldExt = '.js';
const newExt = '.jsx';

// Folders you may want to exclude
const excludeDirs = ['node_modules', 'public', 'build', '.git'];

function shouldExclude(dir) {
  return excludeDirs.some(excluded => dir.includes(excluded));
}

function renameJsToJsx(dirPath) {
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!shouldExclude(filePath)) {
        renameJsToJsx(filePath); // Recurse into subdirectories
      }
    } else if (stat.isFile() && path.extname(file) === oldExt) {
      // Rename .js to .jsx
      const newFilePath = filePath.replace(new RegExp(`${oldExt}$`), newExt);
      fs.renameSync(filePath, newFilePath);
      console.log(`Renamed: ${filePath} -> ${newFilePath}`);

      // Optional: Replace imports inside the file
      let content = fs.readFileSync(newFilePath, 'utf-8');
      content = content.replace(/from\s+['"](.+?)\.js['"]/g, `from '$1.jsx'`);
      fs.writeFileSync(newFilePath, content, 'utf-8');
    }
  });
}

console.log('Starting conversion...');
renameJsToJsx(baseDir);
console.log('Conversion completed!');
