import fs from 'fs';
import path from 'path';
import parseArgs from 'minimist';
import shell from 'shelljs';
import {errorExit} from './utils.mjs';
import allLibraries from '../src/data/libraryDescription.json' with {type: 'json'};
import sampleEmbeds from '../src/config/sampleEmbeds.json' with {type: 'json'};

await import('./prepare-raw.mjs');

const rootDir = path.resolve(import.meta.dirname, '..');

function resolveEnactCmd (cmd) {
	if (!cmd || cmd === 'enact') {
		return 'enact';
	}

	const tokens = cmd.trim().split(/\s+/);
	const useNode = tokens[0] === 'node';
	const scriptIndex = useNode ? 1 : 0;
	const script = tokens[scriptIndex];

	if (!script || path.isAbsolute(script)) {
		return cmd;
	}

	// CI passes paths relative to sample-runner/<theme> (see build-scripts/enact-docs.sh).
	tokens[scriptIndex] = path.resolve(rootDir, 'sample-runner/moonstone', script);

	return tokens.join(' ');
}

const includes = ['core', 'moonstone', 'sandstone', 'limestone', 'agate'],
	themes = Object.keys(allLibraries).filter(name => includes.includes(name));

const args = parseArgs(process.argv),
	fast = args.fast,
	enactCmd = resolveEnactCmd(args['enact-cmd'] || 'enact');

if (!enactCmd && !shell.which('enact')) {
	errorExit('Sorry, this script requires the enact cli tool');
}

themes.forEach(theme => {
	if (!fs.existsSync(`sample-runner/${theme}/node_modules`)) {
		if (shell.exec(`cd sample-runner/${theme} && npm install`).code !== 0) {
			errorExit(`Error installing dependencies for ${theme}.  Aborting.`);
		}
	}

	if (fast && fs.existsSync(`public/${theme}-runner/index.html`)) {
		// eslint-disable-next-line no-console
		console.log(`Sample runner for ${theme} exists, skipping build.  Use "npm run make-runner" to build`);

	} else {
		const command = `cd sample-runner/${theme} && ${enactCmd} pack -p -o ../../public/${theme}-runner`;
		if (shell.exec(command, {async: false}).code !== 0) {
			errorExit(`Error building ${theme}.  Aborting.`);
		}
	}

	if (fs.existsSync(`public/${theme}-runner/index.html`)) {
		const srcBase = `sample-runner/${theme}/node_modules`;
		const dstBase = `public/${theme}-runner/node_modules`;

		shell.rm('-rf', dstBase);

		// Copy back runtime-required assets removed with node_modules.
		for (const dir of [`@enact/${theme}/fonts`, `@enact/${theme}/resources`]) {
			const src = `${srcBase}/${dir}`;
			if (fs.existsSync(src)) {
				const dst = `${dstBase}/${dir}`;
				fs.mkdirSync(dst, {recursive: true});
				shell.cp('-r', `${src}/.`, dst);
			}
		}

		const ilibDst = `${dstBase}/ilib/locale`;
		const ilibFiles = ['localeinfo.json', 'dateformats.json', 'sysres.json',
			'en/localeinfo.json', 'en/dateformats.json', 'en/sysres.json'];
		const copiedIlib = [];
		for (const rel of ilibFiles) {
			const src = `${srcBase}/ilib/locale/${rel}`;
			if (fs.existsSync(src)) {
				const dst = `${ilibDst}/${rel}`;
				fs.mkdirSync(dst.substring(0, dst.lastIndexOf('/')), {recursive: true});
				shell.cp(src, dst);
				copiedIlib.push(rel);
			}
		}

		fs.writeFileSync(`${ilibDst}/ilibmanifest.json`, JSON.stringify({files: copiedIlib}));
	}
});

sampleEmbeds.forEach(({id, build}) => {
	const {src, output} = build;

	if (!fs.existsSync(src)) {
		return;
	}

	if (!fs.existsSync(`${src}/node_modules`)) {
		if (shell.exec(`cd ${src} && npm install`).code !== 0) {
			errorExit(`Error installing dependencies for ${id}.  Aborting.`);
		}
	}

	if (fast && fs.existsSync(`${output}/index.html`)) {
		// eslint-disable-next-line no-console
		console.log(`Sample ${id} exists, skipping build.  Use "npm run make-runner" to build`);
	} else {
		const relOut = path.relative(src, output).split(path.sep).join('/');
		const command = `cd ${src} && ${enactCmd} pack -p -o ${relOut}`;
		if (shell.exec(command, {async: false}).code !== 0) {
			errorExit(`Error building ${id}.  Aborting.`);
		}
	}
});
