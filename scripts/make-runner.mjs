/*
 * This module builds iframe-based enact sample runners and places them into the
 * `/static/*-runner` directory. To build for specific versions of Enact, you must link in or
 * explicitly install the version desired. The exact runners to build are configured from the
 * results of the `parse` process.
 * TODO: Consider having these directories versioned and placed outside the docs repo
 * TODO: Have a smart way to override calling `npm install`
 * TODO: Do we want to have a debug build available?
 */
/* eslint-env node */
'use strict';

import shell from 'shelljs';
import fs from 'fs';
import parseArgs from 'minimist';
const allLibraries = JSON.parse(fs.readFileSync('./src/data/libraryDescription.json'));

const includes = ['core', 'moonstone', 'sandstone', 'agate'];
const themes = Object.keys(allLibraries).filter(name => includes.includes(name));

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

	if (fast && fs.existsSync(`static/${theme}-runner/index.html`)) {
		// eslint-disable-next-line no-console
		console.log(`Sample runner for ${theme} exists, skipping build.  Use "npm run make-runner" to build`);
	} else {
		const command = `cd sample-runner/${theme} && ${enactCmd} pack -p -o ../../static/${theme}-runner`;
		if (shell.exec(command, {async: false}).code !== 0) {
			errorExit(`Error building ${theme}.  Aborting.`);
		}
	}
});

function errorExit (msg, code = 1) {
	console.error(msg);	// eslint-disable-line no-console
	shell.exit(code);
}
