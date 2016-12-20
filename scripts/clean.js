const shelljs = require('shelljs');
shelljs.config.silent = true;

// Clear out all parsed modules
shelljs.rm('-r', 'pages/docs/components/modules');

// Clear out all copied developer guide files (leave behind index.js)
let dirs = shelljs.ls('-d', 'pages/docs/developer-guide/*');
dirs.forEach(dir => {
	if (dir !== 'pages/docs/developer-guide/index.js') {
		shelljs.rm('-r', dir);
	}
});

// Remove the public output directory
shelljs.rm('-r', 'public');

console.log('Clean!');	// eslint-disable-line no-console
