const shelljs = require('shelljs');
shelljs.config.silent = true;

const leaveIndex = (dir, basePath = 'pages/docs/') => {
	// remove everything but leave dir's index.js
	const fullPath = basePath + dir;
	const dirs = shelljs.ls('-d', fullPath + '/*');
	dirs.forEach(dir => {
		if (dir !== fullPath + '/index.js') {
			shelljs.rm('-r', dir);
		}
	});
};

leaveIndex('modules');
leaveIndex('developer-guide');
leaveIndex('developer-tools');

// Remove the public output directory
shelljs.rm('-r', 'public');

// Remove the no-longer-used components directory
shelljs.rm('-r', 'pages/docs/components');

console.log('Clean!');	// eslint-disable-line no-console
