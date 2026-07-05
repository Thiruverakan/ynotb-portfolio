const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy index.html to dist/index.html
fs.copyFileSync('index.html', 'dist/index.html');

// Create dist/src/styles directory
const stylesDest = path.join('dist', 'src', 'styles');
fs.mkdirSync(stylesDest, { recursive: true });

// Copy all files from src/styles/ to dist/src/styles/
const stylesSrc = path.join('src', 'styles');
if (fs.existsSync(stylesSrc)) {
  const files = fs.readdirSync(stylesSrc);
  for (const file of files) {
    fs.copyFileSync(path.join(stylesSrc, file), path.join(stylesDest, file));
  }
}
console.log('Assets copied successfully to dist!');
