import shell from 'shelljs';
import fs from 'fs';
import parseArgs from 'minimist';
import allLibraries from '../src/data/libraryDescription.json' with {type: 'json'};

const includes = ['core', 'moonstone', 'sandstone', 'limestone', 'agate'],
	themes = Object.keys(allLibraries).filter(name => includes.includes(name));

const args = parseArgs(process.argv),
	fast = args.fast,
	enactCmd = args['enact-cmd'] || 'enact';

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

function errorExit (msg, code = 1) {
	console.error(msg);	// eslint-disable-line no-console
	shell.exit(code);
}
