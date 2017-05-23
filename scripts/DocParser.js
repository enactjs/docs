// DocParser scans for all modules in the enact package that contain jsDoc @module declarations
// It then copies all static doc files found in enact, enact-dev and eslint-config-enact.
// It accepts the following command line arguments:
// * --watch - Watch node_modules/enact for changes
// * --static - Only copy static documentation files
// * --no-static - Do not copy static documentation files
// * --pattern <pattern> - Only search for modules that match the pattern specified
//    NOTE: <pattern> looks like: \*moonstone\*, Button.js, or T\*.js
'use strict';

const shelljs = require('shelljs'),
	fs = require('fs'),
	pathModule = require('path'),
	ProgressBar = require('progress'),
	parseArgs = require('minimist'),
	chokidar = require('chokidar'),
	documentation = require('documentation');

const getValidFiles = (pattern) => {
	const searchPattern = pattern || '\*.js';
	const grepCmd = 'grep -r -l "@module" node_modules/enact/packages --exclude-dir build --exclude-dir node_modules --exclude-dir sampler --include=' + searchPattern;
	const moduleFiles = shelljs.exec(grepCmd, {silent: true, maxBuffer: 1024 * 1024 * 1024});

	return moduleFiles.stdout.trim().split('\n');
};

const getDocumentation = (paths) => {
	const docOutputPath = '/pages/docs/modules';
	// TODO: Add @module to all files and scan files and combine json
	const validPaths = paths.reduce((prev, path) => {
		return prev.add(path.split('/').slice(0, -1).join('/'));
	}, new Set());

	const bar = new ProgressBar('Parsing: [:bar] :file (:current/:total)',
								{total: validPaths.size, width: 20, complete: '#', incomplete: ' '});

	validPaths.forEach(function (path) {
		// TODO: If we do change it to scan each file rather than directory we need to fix componentDirectory matching
		let componentDirectory = path.split('packages/')[1];
		const basePath = process.cwd() + docOutputPath;
		// Check for 'spotlight/src' and anything similar
		let componentDirParts = componentDirectory.split('/');
		if ((componentDirParts.length > 1) && (componentDirParts.pop() === 'src')) {
			componentDirectory = componentDirParts.join('/');
		}

		documentation.build(path, {shallow: true}).then(output => {
			bar.tick({file: componentDirectory});
			if (output.length) {
				const outputPath = basePath + '/' + componentDirectory;

				validate(output, path, componentDirectory);

				shelljs.mkdir('-p', outputPath);
				const stringified = JSON.stringify(output, null, 2);

				fs.writeFileSync(outputPath + '/index.json', stringified, 'utf8');
			}
		}).catch((err) => {
			console.log(`Unable to process ${path}: ${err}`);	// eslint-disable-line no-console
			bar.tick({file: componentDirectory});
		});
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

function copyStaticDocs (source, outputBase) {
	const findCmd = `find -L ${source} -type f -path '*/docs/*' -not -path '*/node_modules/*' -not -path '*/build/*'`;
	const docFiles = shelljs.exec(findCmd, {silent: true});
	const files = docFiles.stdout.trim().split('\n');

	if ((files.length < 1) || !files[0]) {	// Empty search has single empty string in array
		console.error('Unable to find docs in', source);	// eslint-disable-line no-console
		process.exit(1);
	}

	console.log(`Processing ${source}`);	// eslint-disable-line no-console

	files.forEach((file) => {
		let outputPath = outputBase;
		const relativeFile = pathModule.relative(source, file);
		const ext = pathModule.extname(relativeFile);
		const base = pathModule.basename(relativeFile);

		if (relativeFile.indexOf('docs') !== 0) {
			const librarypathModule = pathModule.dirname(pathModule.relative('packages/', relativeFile)).replace('/docs', '');
			outputPath += librarypathModule + '/';
		} else {
			const pathPart = pathModule.dirname(pathModule.relative('docs/', relativeFile));

			outputPath += pathPart + '/';
		}

		// TODO: Filter links and fix them
		// Normalize path because './' in outputPath blows up mkdir
		shelljs.mkdir('-p', pathModule.normalize(outputPath));
		if (ext === '.md') {
			let contents = fs.readFileSync(file, 'utf8')
				.replace(/(\((?!http)[^)]+)(\/index.md)/g, '$1/')		// index files become 'root' for new directory
				.replace(/(\((?!http)[^)]+)(.md)/g, '$1/');			// other .md files become new directory under root
			if (file.indexOf('index.md') === -1) {
				contents = contents.replace(/\]\(\.\//g, '](../');	// same level .md files are now relative to root
			}
			fs.writeFileSync(outputPath + base, contents, {encoding: 'utf8'});
		} else {
			shelljs.cp(file, outputPath);
		}
	});
}

function init () {
	const args = parseArgs(process.argv);

	if (args.watch) {
		let watcher = chokidar.watch(
			['node_modules/enact'],	// TODO: Only watching enact for now
			{
				ignored: /(^|[\/\\])\../,
				persistent: true
			}
		);
		// TODO: Match pattern?
		console.log('Watching "node_modules/enact" for changes...');	// eslint-disable-line no-console

		watcher.on('change', path => {
			const validFiles = getValidFiles(path);
			getDocumentation(validFiles);
		});
	} else {
		if (!args.static) {
			const validFiles = getValidFiles(args.pattern);
			getDocumentation(validFiles);
		}
		if (args.static !== false) {
			copyStaticDocs('node_modules/enact/', 'pages/docs/developer-guide/');
			copyStaticDocs('node_modules/enact-dev/', 'pages/docs/developer-tools/enact-dev/');
			copyStaticDocs('node_modules/eslint-config-enact/', 'pages/docs/developer-tools/eslint-config-enact/');
		}
	}
}

init();
