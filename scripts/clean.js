const shelljs = require('shelljs');
shelljs.config.silent = true;

const leaveIndex = (dir, basePath = 'pages/docs/') => {
	// remove everything but leave dir's index.js/index.less
	const fullPath = basePath + dir;
	const entries = shelljs.ls('-d', fullPath + '/*');
	const matchIndex = new RegExp(`${fullPath}\/index\.(js|less)`);
	entries.forEach(entry => {
		if (!matchIndex.test(entry)) {
			shelljs.rm('-r', entry);
		}
	});
};

leaveIndex('modules');
leaveIndex('developer-guide');
leaveIndex('developer-tools');

// Remove the data (parsed content) output directory
shelljs.rm('-r', 'data');

// Remove the public output directory
shelljs.rm('-r', 'public');

// Remove the no-longer-used components directory
shelljs.rm('-r', 'pages/docs/components');

console.log('Clean!');	// eslint-disable-line no-console
