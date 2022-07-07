const shelljs = require('shelljs');
shelljs.config.silent = true;

const leaveIndex = (dir, basePath = 'src/pages/docs/') => {
	// remove everything but leave dir's index.js/index.less
	const fullPath = basePath + dir;
	const entries = shelljs.ls('-d', fullPath + '/*');
	const matchIndex = new RegExp(`${fullPath}/index\\.(js|(module\\.)?less)`);
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

// Remove the sample runner
shelljs.rm('-r', 'static/*-runner');

// Remove theme icons
shelljs.rm('-r', 'static/*.svg');

// Remove jsdoc 
shelljs.rm('-rf', 'src/jsdocs/docs/module/*');

console.log('Clean, with `raw` directory left intact.');	// eslint-disable-line no-console
