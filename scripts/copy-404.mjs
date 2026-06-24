import fs from 'fs';

fs.mkdirSync('dist/404', {recursive: true});
fs.copyFileSync('dist/404.html', 'dist/404/index.html');