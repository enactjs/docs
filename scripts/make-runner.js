/*
 * This module builds the iframe-based enact sample runner and places it into the
 * `/static/sample-runner` directory. To build for specific versions of Enact, you must link in or
 * explicitly install the version desired.
 * TODO: Consider having these directories versioned and placed outside the docs repo
 * TODO: Have a smart way to override calling `npm install`
 * TODO: Do we want to have a debug build available?
 */
/* eslint-env node */
'use strict';

const shell = require('shelljs'),
	fs = require('fs'),
	parseArgs = require('minimist');

const allLibraries = require('../src/data/libraryDescription.json'),
	includes = ['core', 'moonstone', 'sandstone', 'agate'],
	themes = Object.keys(allLibraries).filter(name => includes.includes(name));

const args = parseArgs(process.argv),
	fast = args.fast,
	enactCmd = args['enact-cmd'] || 'enact';

if (!enactCmd && !shell.which('enact')) {
	shell.echo('Sorry, this script requires the enact cli tool');
	shell.exit(1);
}

themes.forEach(theme => {
	if (!fs.existsSync(`sample-runner/${theme}/node_modules`)) {
		shell.exec(`cd sample-runner/${theme} && npm install`);
	}

	if (fast && fs.existsSync(`static/${theme}-runner/index.html`)) {
		// eslint-disable-next-line no-console
		console.log(`Sample runner for ${theme} exists, skipping build.  Use "npm run make-runner" to build`);
		return;
	} else {
		const command = `cd sample-runner/${theme} && ${enactCmd} pack -p -o ../../static/${theme}-runner`;
		shell.exec(command, {async: false});
	}

})
