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

if (!shell.which('enact')) {
	shell.echo('Sorry, this script requires the enact cli tool');
	shell.exit(1);
}

const args = parseArgs(process.argv);
const fast = args.fast;

if (fast && fs.existsSync('static/sample-runner/index.html')) {
	// eslint-disable-next-line no-console
	console.log('Sample runner exists, skipping build.  Use "npm run make-runner" to build');
	process.exit(0);
} else {
	const command = 'cd sample-runner && npm install && enact pack -p -o ../static/sample-runner';
	shell.exec(command, {async: false});
}
