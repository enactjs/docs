const shelljs = require('shelljs');
shelljs.config.silent = true;

const leaveIndex = (dir, basePath = 'pages/docs/') => {
	// remove everything but leave dir's index.js
	const fullPath = basePath + dir;
	const entries = shelljs.ls('-d', fullPath + '/*');
	entries.forEach(entry => {
		if (entry !== fullPath + '/index.js') {
			shelljs.rm('-r', entry);
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
