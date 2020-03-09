/*
 * This module copies the Enact libraries into the `raw` directory as a side effect of loading it.
 * It will not copy if the libraries already exist, unless the `--rebuild-raw` argument is supplied.
 * By default, the `master` branch is copied.  Individual branches can be specified on the command line
 * through the following flags:
 * * `enact-branch`
 * * `cli-branch`
 * * `eslint-config-branch`
 *
 * Additional repos can be pulled into the docs using the following command line arg:
 * * `extra-repos`   (e.g. --extra-repos enact/agate#develop,enact/moonstone#3.2.5)
 */
const shell = require('shelljs'),
	parseArgs = require('minimist'),
	// eslint-disable-next-line no-shadow
	process = require('process');

if (!shell.which('git')) {
	shell.echo('Sorry, this script requires git');
	shell.exit(1);
}

function copyGitHub (repo, destination, force, branch = 'master') {
	const command = `git clone --branch=${branch} --depth 1 git@github.com:${repo}.git ${destination}`;
	if (!force && shell.test('-d', destination)) {
		return;
	}

	// At least try to prevent some heartache
	if (!destination || destination === '.' || destination === '/') {
		throw new Error('invalid destination!');
	}
	shell.rm('-rf', destination);
	shell.exec(command, {async: false});
}

const args = parseArgs(process.argv);
const rebuild = args['rebuild-raw'],
	extraRepos = args['extra-repos'];

copyGitHub('enactjs/enact', 'raw/enact', rebuild, args['enact-branch']);
copyGitHub('enactjs/cli', 'raw/cli', rebuild, args['cli-branch']);
copyGitHub('enactjs/eslint-config-enact', 'raw/eslint-config-enact', rebuild, args['eslint-config-branch']);

if (extraRepos) {
	const repos = extraRepos.split(',');

	repos.forEach(repo => {
		const [name, branch] = repo.split('#'),
			[, lib] = name.split('/'),
			dest = `raw/${lib}`;
		copyGitHub(name, dest, rebuild, branch);
	});
}
