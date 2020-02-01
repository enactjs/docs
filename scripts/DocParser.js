// DocParser scans for all modules in the enact package that contain jsDoc @module declarations
// It then copies all static doc files found in enact, enact cli and eslint-config-enact.
// It accepts the following command line arguments:
// * --strict - Set exit code if parsing error occurs
// * --watch - Watch node_modules/enact for changes
// * --static - Only copy static documentation files
// * --no-static - Do not copy static documentation files
// * --pattern <pattern> - Only search for modules that match the pattern specified
//    NOTE: <pattern> looks like: \*moonstone\*, Button.js, or T\*.js
// * --extra-repos <repo-list>   (e.g. --extra-repos enact/agate#develop,enact/moonstone#3.2.5)
/* eslint-env node */
'use strict';

const parseArgs = require('minimist'),
	chokidar = require('chokidar'),
	{
		getValidFiles,
		getDocumentation,
		postValidate,
		copyStaticDocs,
		generateDocVersion,
		generateIndex
	} = require('@enact/docs-utils');

const dataDir = 'src/data';
const docIndexFile = `${dataDir}/docIndex.json`;

/*
const docVersionFile = `${dataDir}/docVersion.json`;
const libraryDescriptionFile = `${dataDir}/libraryDescription.json`;
const libraryDescription = {};
const allRefs = {};
const allStatics = [];
const allLinks = {};
const allModules = [];

// Documentation.js output is pruned for file size.  The following keys will be deleted:
const keysToIgnore = ['lineNumber', 'position', 'code', 'loc', 'context', 'path', 'loose', 'checked', 'todos', 'errors'];
// These are allowed 'errors' in the documentation.  These are our custom tags.
const allowedErrorTags = ['@curried', '@hoc', '@hocconfig', '@omit', '@required', '@template', '@ui'];
*/

function init () {
	const args = parseArgs(process.argv);
	const strict = args.strict,
		extraRepos = args['extra-repos'],
		modulePaths = ['raw/enact/packages'];

	if (extraRepos) {
		extraRepos.split(',').forEach(path => {
			const [name] = path.split('#'),
				[, lib] = name.split('/'),
				src = `raw/${lib}`;

			modulePaths.push(src);
		});
	}

	require('./prepareRaw');	// populate `raw` directory with source

	if (args.watch) {
		let watcher = chokidar.watch(
			modulePaths,
			{
				ignored: /(^|[/\\])\../,
				persistent: true
			}
		);
		// TODO: Match pattern?
		console.log('Watching for changes...');	// eslint-disable-line no-console

		watcher.on('change', path => {
			const validFiles = getValidFiles(modulePaths, path);	// Using path as match pattern
			getDocumentation(validFiles).then(() => generateIndex(docIndexFile));
			generateDocVersion();
		});
	} else {
		if (!args.static) {
			const validFiles = getValidFiles(modulePaths, args.pattern);
			getDocumentation(validFiles, strict).then(() => {
				postValidate(strict);
				generateIndex(docIndexFile);
			});
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
