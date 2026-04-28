// DocParser scans for all modules in the enact package that contain jsDoc @module declarations
// It then copies all static doc files found in enact, enact cli and eslint-config-enact.
// It accepts the following command line arguments:
// * --strict - Set exit code if parsing error occurs
// * --watch - Watch node_modules/enact for changes
// * --static - Only copy static documentation files
// * --no-static - Do not copy static documentation files
// * --pattern <pattern> - Only search for modules that match the pattern specified
//    NOTE: <pattern> looks like: \*moonstone\*, Button.js, or T\*.js
// * --extra-repos <repo-list>   (e.g. --extra-repos enactjs/agate#develop,enactjs/moonstone#3.2.5)
/* eslint-env node */
'use strict';

import fs from 'fs';
import parseArgs from 'minimist';
import chokidar from 'chokidar';
import {execSync} from 'child_process';
import {
	getValidFiles,
	getDocumentation,
	postValidate,
	copyStaticDocs,
	generateIndex,
	getDocsConfig,
	extractLibraryDescription,
	saveLibraryDescriptions
} from '@enact/docs-utils';

function escapeMdxExpressionsForStatic(text) {
	if (!text || typeof text !== 'string') return text;

	let result = '';
	let i = 0;
	let inCodeBlock = false;
	let inInlineCode = false;

	while (i < text.length) {
		// Track code blocks (```...)
		if (text.slice(i, i + 3) === '```') {
			inCodeBlock = !inCodeBlock;
			result += text.slice(i, i + 3);
			i += 3;
			continue;
		}

		if (inCodeBlock) {
			result += text[i++];
			continue;
		}

		// Track inline code (`...`)
		if (text[i] === '`' && (i === 0 || text[i - 1] !== '\\')) {
			inInlineCode = !inInlineCode;
			result += text[i++];
			continue;
		}
		if (inInlineCode) {
			result += text[i++];
			continue;
		}

		// Best-effort escape of MDX expressions like {a, b} in prose
		if (text[i] === '{') {
			let depth = 1;
			let j = i + 1;
			while (j < text.length && depth > 0) {
				if (text[j] === '{') depth++;
				else if (text[j] === '}') depth--;
				j++;
			}
			if (depth === 0) {
				const inner = text.slice(i + 1, j - 1);
				const looksLikeDoc = /^[\w\s,:{}\[\]().#\/\-'"]+$/.test(inner) &&
					!inner.includes('${') &&
					!inner.trim().startsWith('<');
				if (looksLikeDoc) {
					result += '`' + text.slice(i, j) + '`';
					i = j;
					continue;
				}
			}
		}

		result += text[i++];
	}

	return result;
}

function escapeMdxAngleBrackets(text) {
	if (!text || typeof text !== 'string') return text;
	// Escape <-- pattern (comment arrows)
	let result = text.replace(/<--/g, '&lt;--');
	// Escape <email@domain.com> pattern - angle brackets around email-like strings
	result = result.replace(/<([^\s<>'"]+@[^\s<>'"]+)>/g, '&lt;$1&gt;');
	return result;
}

function getAllDocFiles(dir, files = []) {
	for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
		const fullPath = `${dir}/${entry.name}`;
		if (entry.isDirectory()) {
			// Ignore vendored dependency trees if they were copied by mistake.
			if (entry.name === 'node_modules') continue;
			getAllDocFiles(fullPath, files);
		} else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
			files.push(fullPath);
		}
	}
	return files;
}

function pruneCopiedDependencyTrees() {
	const docsDir = `${process.cwd()}/docs`;
	if (!fs.existsSync(docsDir)) return;

	const queue = [docsDir];
	while (queue.length > 0) {
		const current = queue.pop();
		const entries = fs.readdirSync(current, {withFileTypes: true});
		for (const entry of entries) {
			const fullPath = `${current}/${entry.name}`;
			if (!entry.isDirectory()) continue;
			if (entry.name === 'node_modules') {
				try {
					fs.rmSync(fullPath, {recursive: true, force: true, maxRetries: 5, retryDelay: 200});
				} catch (e) {
					// Some Windows directory junction trees (file:../.. links) fail with ENOTEMPTY.
					// Fallback to cmd rmdir with long-path prefix.
					const longPath = `\\\\?\\${fullPath.replace(/\//g, '\\')}`;
					execSync(`cmd /c rmdir /s /q "${longPath}"`, {stdio: 'ignore'});
				}
				console.log(`Removed copied dependency tree: ${fullPath.replace(`${process.cwd()}/`, '')}`); // eslint-disable-line no-console
				continue;
			}
			queue.push(fullPath);
		}
	}
}

function inferFenceLanguage(blockLines) {
	const firstNonEmpty = blockLines.find(line => line.trim() !== '');
	if (!firstNonEmpty) return 'js';
	const s = firstNonEmpty.trim();

	if (/^<!DOCTYPE/i.test(s) || /^<\/?[A-Za-z][^>]*>/.test(s) || /^<\w/.test(s)) {
		return 'html';
	}

	if (
		/^(:root|:global|@media|@keyframes|@supports)\b/.test(s) ||
		/^[.#]?[A-Za-z_][\w-]*\s*\{/.test(s) ||
		/^--[A-Za-z][\w-]*\s*:/.test(s)
	) {
		return 'css';
	}

	if (/^(npm|yarn|pnpm|npx|git|node|cd|ls|cp|mv|rm)\b/.test(s)) {
		return 'bash';
	}

	return 'js';
}

function addCodeFenceLanguages(text) {
	if (!text || typeof text !== 'string') return text;
	const lines = text.split(/\r?\n/);
	let inFence = false;

	for (let i = 0; i < lines.length; i++) {
		const trimmed = lines[i].trim();

		// Closing fence (plain ```).
		if (trimmed === '```' && inFence) {
			inFence = false;
			continue;
		}

		// Repair malformed closing fences like ```js used as a closer.
		if (/^```[\w-]+$/.test(trimmed) && inFence) {
			lines[i] = '```';
			inFence = false;
			continue;
		}

		// Opening fence with existing language (```js, ```css, etc.)
		if (/^```[\w-]+$/.test(trimmed) && !inFence) {
			inFence = true;
			continue;
		}

		// Opening fence without language
		if (trimmed === '```' && !inFence) {
			let j = i + 1;
			while (j < lines.length && lines[j].trim() !== '```') j++;
			if (j >= lines.length) break;

			const blockLines = lines.slice(i + 1, j);
			const lang = inferFenceLanguage(blockLines);
			lines[i] = `\`\`\`${lang}`;
			inFence = true;
		}
	}

	return lines.join('\n');
}

// Same behavior as jsonParser.fixStaticDocsContent, but scoped here to avoid importing jsonParser
function fixStaticDocsContent(content, relPath) {
	let result = content;
	// Normalize github: URLs to use forward slashes
	result = result.replace(/^github: ([^\n]+)$/gm, (_, url) => `github: ${url.replace(/\\/g, '/')}`);
	// JSX in Docusaurus expects style as an object, not HTML string attributes. Strip inline styles from
	// copied legacy markdown HTML blocks to avoid SSG runtime errors.
	result = result.replace(/\sstyle=(['"]).*?\1/g, '');
	// Escape problematic angle bracket patterns
	result = escapeMdxAngleBrackets(result);
	// Convert HTML comments to MDX-safe comments.
	result = result.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
	// Only apply expression escaping to generated API docs (docs/*/index.mdx), not top-level authord docs
	if (!/^docs\/[^/]+\.mdx?$/.test(relPath)) {
		result = escapeMdxExpressionsForStatic(result);
	}
	if (
		relPath.startsWith('docs/tutorials/') ||
		relPath.startsWith('docs/developer-guide/') ||
		relPath.startsWith('docs/developer-tools/')
	) {
		result = addCodeFenceLanguages(result);
	}

	// Normalize legacy links in copied static docs so regenerating via parse-docs
	// does not reintroduce broken links/anchors.
	result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
		return `[${label}](${normalizeStaticDocLink(href, relPath)})`;
	});
	result = result.replace(/href=(['"])([^'"]+)\1/g, (_m, q, href) => {
		return `href=${q}${normalizeStaticDocLink(href, relPath)}${q}`;
	});

	return result;
}

function normalizeStaticDocLink(href, relPath) {
	if (!href || typeof href !== 'string') return href;
	let fixed = href.trim();
	if (/^(https?:)?\/\//i.test(fixed) || /^mailto:/i.test(fixed) || fixed.startsWith('#')) return fixed;

	const inDevGuide = relPath.startsWith('docs/developer-guide/');
	const inDevToolsCli = relPath.startsWith('docs/developer-tools/cli/');
	const inMigrationEnact = relPath.startsWith('docs/developer-guide/migration/enact/');
	const inMigrationEnyo = relPath.startsWith('docs/developer-guide/migration/enyo/');
	const inSpotlightDocs = relPath.startsWith('docs/developer-guide/spotlight/docs/');
	const inI18nDocs = relPath.startsWith('docs/developer-guide/i18n/docs/');
	const inWebosDocs = relPath.startsWith('docs/developer-guide/webos/docs/');

	if (inDevGuide) {
		fixed = fixed.replace(/^\.\.\/theming\/?$/, '/docs/developer-guide/theming/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-tools\/cli\/?$/, '/docs/developer-tools/cli/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-tools\/cli\/isomorphic-support\/?$/, '/docs/developer-tools/cli/isomorphic-support/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-tools\/cli\/ejecting-apps\/?$/, '/docs/developer-tools/cli/ejecting-apps/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-guide\/i18n\/?$/, '/docs/developer-guide/i18n/docs/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-guide\/theming\/?$/, '/docs/developer-guide/theming/');
	}

	if (inDevToolsCli) {
		fixed = fixed.replace(/^\.\.\/isomorphic-support\/?$/, './isomorphic-support/');
		fixed = fixed.replace(/^\.\.\/serving-apps\/?$/, './serving-apps/');
		fixed = fixed.replace(/^\.\.\/starting-a-new-app\/?/, './starting-a-new-app/');
		fixed = fixed.replace(/^\.\.\/developing-a-template\/?$/, './developing-a-template/');
	}

	if (inMigrationEnact) {
		fixed = fixed.replace(/^\.\.\/migrating-to-enact-2\/?$/, './migrating-to-enact-2.md');
		fixed = fixed.replace(/^\.\.\/migrating-to-enact-3\/?$/, './migrating-to-enact-3.md');
		fixed = fixed.replace(/^\.\.\/migrating-to-enact-4\/?$/, './migrating-to-enact-4.md');
	}

	if (inMigrationEnyo) {
		fixed = fixed.replace(/^\.\.\/enyo-enact-component-map\/?$/, './enyo-enact-component-map/');
		fixed = fixed.replace(/^\.\.\/\.\.\/spotlight\/#containers$/, '/docs/developer-guide/spotlight/docs/#containers');
		fixed = fixed.replace(/^\.\.\/\.\.\/spotlight\/#spottable$/, '/docs/developer-guide/spotlight/docs/#spottable');
		fixed = fixed.replace(/^\.\.\/\.\.\/spotlight\/#events$/, '/docs/developer-guide/spotlight/docs/#events');
		fixed = fixed.replace(/^\.\.\/\.\.\/webos\/luna-service-api\/?$/, '/docs/developer-guide/webos/docs/luna-service-api/');
		fixed = fixed.replace(/^\/docs\/$/, '/docs/api');
		fixed = fixed.replace(/^\/docs\/redux\/?$/, '/docs/developer-guide/redux/');
		fixed = fixed.replace(/^\/docs\/webos\/luna-service-api\/?$/, '/docs/developer-guide/webos/docs/luna-service-api/');
		fixed = fixed.replace(/^\/docs\/spotlight\/#containers$/, '/docs/developer-guide/spotlight/docs/#containers');
		fixed = fixed.replace(/^\/docs\/spotlight\/#spottable$/, '/docs/developer-guide/spotlight/docs/#spottable');
		fixed = fixed.replace(/^\/docs\/spotlight\/#events$/, '/docs/developer-guide/spotlight/docs/#events');
	}

	fixed = fixed.replace(/^\/docs\/developer-guide\/i18n\/?$/, '/docs/developer-guide/i18n/docs/');

	if (inSpotlightDocs) {
		fixed = fixed.replace(/^\.\.\/\.\.\/modules\/spotlight\/Spottable\/?$/, '/docs/spotlight/Spottable');
		fixed = fixed.replace(/^\.\.\/\.\.\/modules\/spotlight\/SpotlightContainerDecorator\/?$/, '/docs/spotlight/SpotlightContainerDecorator');
	}

	if (inI18nDocs) {
		fixed = fixed.replace(/^\.\.\/$/, './');
	}

	if (inWebosDocs) {
		fixed = fixed.replace(/^\.\.\/luna-service-api\/#example$/, './luna-service-api/#example');
	}

	if (relPath === 'docs/developer-guide/performance.md') {
		fixed = fixed.replace(/^\/docs\/core\/util\/#Job$/, '/docs/core/util/');
		fixed = fixed.replace(/^\/docs\/core\/util\/#perfNow$/, '/docs/core/util/');
	}

	return fixed;
}

function fixAllStaticDocs() {
	const docsDir = `${process.cwd()}/docs`;
	if (!fs.existsSync(docsDir)) return;

	const files = getAllDocFiles(docsDir);
	let modified = 0;

	for (const file of files) {
		const content = fs.readFileSync(file, 'utf8');
		const relPath = file.replace(`${process.cwd()}/`, '').replace(/\\/g, '/');
		const fixed = fixStaticDocsContent(content, relPath);
		if (fixed !== content) {
			fs.writeFileSync(file, fixed, 'utf8');
			modified++;
			console.log(`Fixed static doc: ${relPath}`); // eslint-disable-line no-console
		}
	}

	if (modified > 0) {
		console.log(`\nFixed ${modified} static doc file(s).`); // eslint-disable-line no-console
	}
}

const docIndexFile = `src/data/docIndex.json`;

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

// Returns `module`'s `parseSource` member (for filtering parsable modules)
function sourceFilter (module) {	// eslint-disable-line no-shadow
	return module.parseSource;
}

function ensureExtraRepoDescriptions(extraReposArg, allDescriptions) {
	if (!extraReposArg) return;

	extraReposArg.split(',').forEach(spec => {
		const [name] = spec.split('#');
		const [, lib] = name.split('/');
		if (!lib || allDescriptions[lib]) return;

		const pkgPath = `raw/${lib}/package.json`;
		let pkg = {};
		if (fs.existsSync(pkgPath)) {
			try {
				pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
			} catch (e) {
				pkg = {};
			}
		}

		allDescriptions[lib] = {
			packageName: pkg.name || `@enact/${lib}`,
			version: pkg.version || 'unknown',
			dependencies: pkg.dependencies || {},
			hasConfig: false,
			parseSource: true,
			description: pkg.description || `${lib} library`
		};
	});
}

async function init () {
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

	await import('./prepareRaw.js');

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
					outputTo = 'docs/' + (dests[libName] || 'developer-guide');

				copyStaticDocs({
					icon: moduleConfig.icon,
					source: moduleConfig.path,
					outputTo
				});

				Object.assign(allDescriptions, extractLibraryDescription(moduleConfig));
			});

			// Some extra repos may not expose docs-utils metadata the same way as core repos.
			// Ensure they still appear in src/data/libraryDescription.json for api.mdx cards.
			ensureExtraRepoDescriptions(extraRepos, allDescriptions);

			saveLibraryDescriptions(allDescriptions);
			pruneCopiedDependencyTrees();

			// (fix github: backslashes, angle-bracketed emails, and {expr} in prose).
			fixAllStaticDocs();
		}
	}

	// const jsonFiles = getAllJsonFiles('src/pages/modules');
	// for (const file of jsonFiles) {
	// 	jsonParer(file);
	// }
}

await init();
