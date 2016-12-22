const shelljs = require('shelljs');
shelljs.config.silent = true;

// Clear out all parsed modules
let dirs = shelljs.ls('-d', 'pages/docs/modules/*');
dirs.forEach(dir => {
	if (dir !== 'pages/docs/modules/index.js') {
		shelljs.rm('-r', dir);
	}
});

// Clear out all copied developer guide files (leave behind index.js)
dirs = shelljs.ls('-d', 'pages/docs/developer-guide/*');
dirs.forEach(dir => {
	if (dir !== 'pages/docs/developer-guide/index.js') {
		shelljs.rm('-r', dir);
	}
});

// Remove the developer-tools directory
shelljs.rm('-r', 'pages/docs/developer-tools');

// Remove the public output directory
shelljs.rm('-r', 'public');

// Remove the no-longer-used components directory
shelljs.rm('-r', 'pages/docs/components');

console.log('Clean!');	// eslint-disable-line no-console
