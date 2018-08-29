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

const args = parseArgs(process.argv),
	fast = args.fast,
	enactCmd = args['enact-cmd'] || 'enact';

if (!enactCmd && !shell.which('enact')) {
	shell.echo('Sorry, this script requires the enact cli tool');
	shell.exit(1);
}

if (!fs.existsSync('sample-runner/node_modules')) {
	shell.exec('cd sample-runner && npm install');
}

if (fast && fs.existsSync('static/sample-runner/index.html')) {
	// eslint-disable-next-line no-console
	console.log('Sample runner exists, skipping build.  Use "npm run make-runner" to build');
	process.exit(0);
} else {
	const command = `cd sample-runner && ${enactCmd} pack -p -o ../static/sample-runner`;
	shell.exec(command, {async: false});
}
