const shell = require('shelljs'),
	parseArgs = require('minimist'),
	process = require('process');

if (!shell.which('git')) {
	shell.echo('Sorry, this script requires git');
	shell.exit(1);
}

function copyGitHub (repo, destination, branch = 'master') {
	const command = `git clone --branch=${branch} --depth 1 https://github.com/${repo}.git ${destination}`;

	// At least try to prevent some heartache
	if (!destination || destination === '.' || destination === '/') {
		throw new Error('invalid destination!');
	}
	shell.rm('-rf', destination);
	shell.exec(command, {async: false});
}

const args = parseArgs(process.argv);
const force = args['force-github'];

if (force || !shell.test('-d', 'raw/enact')) {
	const branch = args['enact-branch'];

	copyGitHub('enactjs/enact', 'raw/enact', branch);
}

if (force || !shell.test('-d', 'raw/cli')) {
	const branch = args['cli-branch'];

	copyGitHub('enactjs/cli', 'raw/cli', branch);
}

if (force || !shell.test('-d', 'raw/eslint-config-enact')) {
	const branch = args['eslint-config-branch'];

	copyGitHub('enactjs/eslint-config-enact', 'raw/eslint-config-enact', branch);
}
