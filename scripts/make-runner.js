/*
 * This module builds the iframe-based enact sample runner and places it into the
 * `/static/sample-runner` directory. To build for specific versions of Enact, you must link in or
 * explicitly install the version desired.
 * TODO: Consider having these directories versioned and placed outside the docs repo
 * TODO: Have a smart way to override calling `npm install`
 * TODO: Do we want to have a debug build available?
 */
const shell = require('shelljs');

if (!shell.which('enact')) {
	shell.echo('Sorry, this script requires the enact dev tool');
	shell.exit(1);
}

const command = 'cd sample-runner && npm install && enact pack -p -o ../static/sample-runner';
shell.exec(command, {async: false});

