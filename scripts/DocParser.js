'use strict';

const shelljs = require('shelljs'),
	fs = require('fs');


const getValidFiles = () => {
	const grepCmd = 'grep -r -l "@module" node_modules/enact/packages --exclude-dir node_modules --exclude-dir sampler --include=\*.js';
	const moduleFiles = shelljs.exec(grepCmd, {silent: true});

	return moduleFiles.stdout.trim().split('\n');
};

const getDocumentation = (paths) => {
	const docOutputPath = '/pages/docs/components/modules';

	// TODO: Add @module to all files and scan files and combine json
	const validPaths = paths.reduce((prev, path) => {
		return prev.add(path.split('/').slice(0, -1).join('/'));
	}, new Set());

	validPaths.forEach(function (path) {
		// TODO: If we do change it to scan each file rather than directory we need to fix componentDirectory matching
		const componentDirectory = path.split('packages/')[1];
		const basePath = process.cwd() + docOutputPath;
		const cmd = 'documentation build ' + path + ' --shallow';
		const output = shelljs.exec(cmd, {silent: true});

		if (output.code === 0) {
			const docs = JSON.parse(output.stdout.trim());

			if (docs.length) {
				const outputPath = basePath + '/' + componentDirectory;

				validate(docs, path, componentDirectory);

				shelljs.mkdir('-p', outputPath);
				const stringified = JSON.stringify(docs, null, 2);

				fs.writeFileSync(outputPath + '/index.json', stringified, 'utf8');
			}
		}
	});
};

function validate (docs, name, componentDirectory) {
	function warn (msg) {
		console.log(`${name}: ${msg}`);	// eslint-disable-line no-console
	}

	if (docs.length > 1) {
		warn(`Too many doclets: ${docs.length}`);
	}
	if ((docs[0].path) && (docs[0].path[0].kind === 'module')) {
		if (docs[0].path[0].name !== componentDirectory) {
			warn('Module name does not match path');
		}
	} else {
		warn('First item not a module');
	}
}


function init () {
	const validFiles = getValidFiles();
	getDocumentation(validFiles);
}

init();
