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
		generateIndex,
		getDocsConfig,
		extractLibraryDescription,
		saveLibraryDescriptions
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

// Returns `module`'s `parseSource` member (for filtering parseable modules)
function sourceFilter (module) {	// eslint-disable-line no-shadow
	return module.parseSource;
}

function init () {
	const args = parseArgs(process.argv);
	const strict = args.strict,
		extraRepos = args['extra-repos'],
		modulePaths = ['raw/enact', 'raw/eslint-config-enact', 'raw/cli'];

	if (extraRepos) {
		extraRepos.split(',').forEach(path => {
			const [name] = path.split('#'),
				[, lib] = name.split('/'),
				src = `raw/${lib}`;

			modulePaths.push(src);
		});
	}

	require('./prepareRaw');	// populate `raw` directory with source

	const moduleConfigs = modulePaths.map(getDocsConfig);

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
			const validFiles = getValidFiles(moduleConfigs.filter(sourceFilter), path);	// Using path as match pattern
			getDocumentation(validFiles).then(() => generateIndex(docIndexFile));
		});
	} else {
		if (!args.static) {
			const validFiles = getValidFiles(moduleConfigs.filter(sourceFilter), args.pattern);
			getDocumentation(validFiles, strict).then(() => {
				postValidate(strict);
				generateIndex(docIndexFile);
			});
		}
		if (args.static !== false) {
			const allDescriptions = {};

			moduleConfigs.forEach(moduleConfig => {
				// TODO: Collapse this it's all in the config and can be passed directly
				const libName = moduleConfig.path.split('/').pop(),
					dests = {
						'cli': 'developer-tools/cli/',
						'eslint-config-enact': 'developer-tools/eslint-config-enact',
						'enact': 'developer-guide'
					},
					outputTo = 'src/pages/docs/' + (dests[libName] || 'developer-guide');

				copyStaticDocs({
					icon: moduleConfig.icon,
					source: moduleConfig.path,
					outputTo
				});

				Object.assign(allDescriptions, extractLibraryDescription(moduleConfig));
			});

			saveLibraryDescriptions(allDescriptions);
		}
	}
}

init();
