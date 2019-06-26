// DocParser scans for all modules in the enact package that contain jsDoc @module declarations
// It then copies all static doc files found in enact, enact cli and eslint-config-enact.
// It accepts the following command line arguments:
// * --strict - Set exit code if parsing error occurs
// * --watch - Watch node_modules/enact for changes
// * --static - Only copy static documentation files
// * --no-static - Do not copy static documentation files
// * --pattern <pattern> - Only search for modules that match the pattern specified
//    NOTE: <pattern> looks like: \*moonstone\*, Button.js, or T\*.js
/* eslint-env node */
'use strict';

const shelljs = require('shelljs'),
	fs = require('fs'),
	pathModule = require('path'),
	ProgressBar = require('progress'),
	parseArgs = require('minimist'),
	chokidar = require('chokidar'),
	documentation = require('documentation'),
	elasticlunr = require('elasticlunr'),
	jsonata = require('jsonata'),
	readdirp = require('readdirp'),
	mkdirp = require('mkdirp'),
	toc = require('markdown-toc'),
	jsonfile = require('jsonfile');

const dataDir = 'src/data';
const docIndexFile = `${dataDir}/docIndex.json`;
const docVersionFile = `${dataDir}/docVersion.json`;
const libraryDescriptionFile = `${dataDir}/libraryDescription.json`;
const libraryDescription = {};

// Documentation.js output is pruned for file size.  The following keys will be deleted:
const keysToIgnore = ['lineNumber', 'position', 'code', 'loc', 'context', 'path', 'loose', 'checked', 'todos', 'errors'];
// These are allowed 'errors' in the documentation.  These are our custom tags.
const allowedErrorTags = ['@hoc', '@hocconfig', '@ui', '@required', '@omit', '@template'];

const getValidFiles = (pattern) => {
	const searchPattern = pattern || '*.js';
	const grepCmd = 'grep -r -l "@module" raw/enact/packages --exclude-dir build --exclude-dir node_modules --exclude-dir sampler --include=' + searchPattern;
	const moduleFiles = shelljs.exec(grepCmd, {silent: true});

	return moduleFiles.stdout.trim().split('\n');
};

const getDocumentation = (paths, strict) => {
	const docOutputPath = '/src/pages/docs/modules';
	// TODO: Add @module to all files and scan files and combine json
	const validPaths = paths.reduce((prev, path) => {
		return prev.add(path.split('/').slice(0, -1).join('/'));
	}, new Set());
	const promises = [];

	const bar = new ProgressBar('Parsing: [:bar] (:current/:total) :file',
		{total: validPaths.size, width: 20, complete: '#', incomplete: ' '});

	validPaths.forEach(function (path) {
		// TODO: If we do change it to scan each file rather than directory we need to fix componentDirectory matching
		let componentDirectory = path.split('packages/')[1];
		const basePath = process.cwd() + docOutputPath;
		// Check for 'spotlight/src' and anything similar
		let componentDirParts = componentDirectory && componentDirectory.split('/');
		if ((Array.isArray(componentDirParts) && componentDirParts.length > 1) && (componentDirParts.pop() === 'src')) {
			componentDirectory = componentDirParts.join('/');
		}

		promises.push(documentation.build(path, {shallow: true}).then(output => {
			bar.tick({file: componentDirectory});
			if (output.length) {
				const outputPath = basePath + '/' + componentDirectory;

				validate(output, path, componentDirectory, strict);

				shelljs.mkdir('-p', outputPath);
				const stringified = JSON.stringify(output, (k, v) => {
					if (k === 'errors' && v.length !== 0) {
						v.forEach(err => {
							const shortMsg = err.message ? err.message.replace('unknown tag ', '') : '';
							if (!shortMsg) {
								// eslint-disable-next-line no-console
								console.log(`\nParse error: ${err} in ${path}`);
							} else if (!allowedErrorTags.includes(shortMsg)) {
								// eslint-disable-next-line no-console
								console.log(`\nParse error: ${err.message} in ${path}:${err.commentLineNumber}`);
							}
						});
					}
					return (keysToIgnore.includes(k)) ? void 0 : v;
				}, 2);

				fs.writeFileSync(outputPath + '/index.json', stringified, 'utf8');
			}
		}).catch((err) => {
			console.log(`Unable to process ${path}: ${err}`);	// eslint-disable-line no-console
			bar.tick({file: componentDirectory});
		}));
	});
	return Promise.all(promises);
};

function docNameAndPosition (doc) {
	const filename = doc.context.file.replace(/.*\/raw\/enact\//, '');
	return `${doc.name} in ${filename}:${doc.context.loc.start.line}`;
}

function validate (docs, name, componentDirectory, strict) {
	function warn (msg) {
		console.log(`${name}: ${msg}`);	// eslint-disable-line no-console
		if (strict) {
			console.log('strict');	// eslint-disable-line no-console
			process.exitCode = 1;
		}
	}

	if (docs.length > 1) {
		const doclets = docs.map(docNameAndPosition).join('\n');
		warn(`\nToo many doclets (${docs.length}):\n${doclets}`);
	}
	if ((docs[0].path) && (docs[0].path[0].kind === 'module')) {
		if (docs[0].path[0].name !== componentDirectory) {
			warn(`\nModule name (${docs[0].path[0].name}) does not match path: ${componentDirectory} in ${docNameAndPosition(docs[0])}`);
		}
	} else {
		warn(`\nFirst item not a module: ${docs[0].path[0].name} (${docs[0].path[0].kind}) in ${docNameAndPosition(docs[0])}`);
	}
}

function parseTableOfContents (frontMatter, body) {
	let maxdepth;
	const tocConfig = frontMatter.match(/^toc: ?(false|\d+)$/m);
	if (tocConfig) {
		if (tocConfig[1].toLowerCase() === 'false') {
			return '';
		}

		maxdepth = Number.parseInt(tocConfig[1]);
	}

	const table = toc(body, {maxdepth});
	if (table.json.length < 3) {
		return '';
	}

	return `
<nav role="navigation" class="page-toc">

${table.content}

</nav>
`;
}

function prependTableOfContents (contents) {
	let table = '';
	let frontMatter = '';
	let body = contents;

	if (contents.startsWith('---')) {
		const endOfFrontMatter = contents.indexOf('---', 4) + 3;
		frontMatter = contents.substring(0, endOfFrontMatter);
		body = contents.substring(endOfFrontMatter);

		table = parseTableOfContents(frontMatter, body);
	}

	return `${frontMatter}${table}\n${body}`;
}

function copyStaticDocs ({source, outputTo: outputBase, getLibraryDescription = false}) {
	const findCmdBase = '-type f -not -path "*/sampler/*" -not -path "*/node_modules/*" -not -path "*/build/*"';
	const findCmd = getLibraryDescription ?
		`find -L ${source} -iname "readme.md" -path "*/packages/*" ${findCmdBase}` : `find -L ${source} -path "*/docs/*" ${findCmdBase}`;
	const docFiles = shelljs.exec(findCmd, {silent: true});
	const files = docFiles.stdout.trim().split('\n');

	if ((files.length < 1) || !files[0]) {	// Empty search has single empty string in array
		console.error('Unable to find docs in', source);	// eslint-disable-line no-console
		process.exit(1);
	}

	console.log(`Processing ${source}`);	// eslint-disable-line no-console

	files.forEach((file) => {
		let outputPath = outputBase;
		let currentLibrary = '';
		const relativeFile = pathModule.relative(source, file);
		const ext = pathModule.extname(relativeFile);
		const base = pathModule.basename(relativeFile);
		// Cheating, discard 'raw' and get directory name -- this will work with 'enact/packages'
		const packageName = source.replace(/raw\/([^/]*)\/(.*)?/, '$1/blob/develop/$2');
		let githubUrl = `github: https://github.com/enactjs/${packageName}${relativeFile}\n`;

		if (relativeFile.indexOf('docs') !== 0) {
			currentLibrary = getLibraryDescription ? pathModule.dirname(relativeFile) : currentLibrary;
			const librarypathModule = getLibraryDescription ? currentLibrary : pathModule.dirname(pathModule.relative('packages/', relativeFile)).replace('/docs', '');

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
				.replace(/(---\ntitle:.*)\n/, '$1\n' + githubUrl)
				.replace(/(\((?!http)[^)]+)(\/index.md)/g, '$1/')		// index files become 'root' for new directory
				.replace(/(\((?!http)[^)]+)(.md)/g, '$1/');			// other .md files become new directory under root
			if (file.indexOf('index.md') === -1) {
				contents = contents.replace(/\]\(\.\//g, '](../');	// same level .md files are now relative to root
				if (getLibraryDescription) {
					// grabbing the description from the each library `README.MD` which is the sentence that starts with the character `>`. Adding each description into a js object.
					const description = contents.split('\n')[2].split('> ')[1];
					libraryDescription[currentLibrary] = description;
				}
			}
			if (!getLibraryDescription) {
				contents = prependTableOfContents(contents);
				fs.writeFileSync(outputPath + base, contents, {encoding: 'utf8'});
			}
		} else {
			shelljs.cp(file, outputPath);
		}
	});
}

function generateIndex () {
	// Note: The $map($string) is needed because spotlight has a literal 'false' in a return type!
	const expression = `{
	  "title": name,
	  "description": $join(description.**.value, ' '),
	  "memberDescriptions": $join(members.**.value ~> $map($string), ' '),
	  "members": $join(**.members.*.name,' ')
	}`;

	const elasticlunrNoStem = function (config) {
		let idx = new elasticlunr.Index();

		idx.pipeline.add(
			elasticlunr.trimmer,
			elasticlunr.stopWordFilter
		);

		if (config) config.call(idx, idx);

		return idx;
	};

	let index = elasticlunrNoStem(function () {
		this.addField('title');
		this.addField('description');
		this.addField('members');
		this.addField('memberDescriptions');
		this.setRef('title');
		this.saveDocument(false);
	});

	console.log('Generating search index...');	// eslint-disable-line no-console

	readdirp({root: 'src/pages/docs/modules', fileFilter: '*.json'}, (err, res) => {
		if (!err) {
			res.files.forEach(result => {
				const filename = result.fullPath;
				const json = jsonfile.readFileSync(filename);
				try {
					index.addDoc(jsonata(expression).evaluate(json));
				} catch (ex) {
					console.log(`Error parsing ${result.path}`);	// eslint-disable-line no-console
					console.log(ex);	// eslint-disable-line no-console
				}
			});
			makeDataDir();
			jsonfile.writeFileSync(docIndexFile, index.toJSON());
		} else {
			console.error('Unable to find parsed documentation!');	// eslint-disable-line no-console
			process.exit(1);
		}
	});
	generateLibraryDescription();
}

function makeDataDir () {
	mkdirp.sync(dataDir);
}

function generateLibraryDescription () {
	const exportContent = JSON.stringify(libraryDescription);
	makeDataDir();
	// generate a json file that contains the description to the corresponding libraries
	fs.writeFileSync(libraryDescriptionFile, exportContent, {encoding: 'utf8'});
}

function generateDocVersion () {
	const packageInfo = jsonfile.readFileSync('raw/enact/package.json');
	const version = JSON.stringify({docVersion: packageInfo.version});
	makeDataDir(); // just in case
	fs.writeFileSync(docVersionFile, version, {encoding: 'utf8'});
}

function init () {
	const args = parseArgs(process.argv);
	const strict = args.strict;

	require('./prepareRaw');	// populate `raw` directory with source

	if (args.watch) {
		let watcher = chokidar.watch(
			['raw/enact'],	// TODO: Only watching enact for now
			{
				ignored: /(^|[/\\])\../,
				persistent: true
			}
		);
		// TODO: Match pattern?
		console.log('Watching "raw/enact" for changes...');	// eslint-disable-line no-console

		watcher.on('change', path => {
			const validFiles = getValidFiles(path);
			getDocumentation(validFiles).then(generateIndex());
			generateDocVersion();
		});
	} else {
		if (!args.static) {
			const validFiles = getValidFiles(args.pattern);
			getDocumentation(validFiles, strict).then(generateIndex);
		}
		if (args.static !== false) {
			copyStaticDocs({
				source: 'raw/enact/',
				outputTo: 'src/pages/docs/developer-guide/'
			});
			copyStaticDocs({
				source: 'raw/enact/packages/',
				outputTo: 'src/pages/docs/modules/',
				getLibraryDescription: true
			});
			copyStaticDocs({
				source: 'raw/cli/',
				outputTo: 'src/pages/docs/developer-tools/cli/'
			});
			copyStaticDocs({
				source: 'raw/eslint-config-enact/',
				outputTo: 'src/pages/docs/developer-tools/eslint-config-enact/'
			});
		}
		generateDocVersion();
	}
}

init();
