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
	fs = require('fs'),
	// eslint-disable-next-line no-shadow
	process = require('process');

if (!shell.which('git')) {
	shell.echo('Sorry, this script requires git');
	shell.exit(1);
}

function copyGitHub (repo, destination, force, branch = 'master', useSSH) {
	const url = useSSH ? `git@github.com:${repo}.git` : `https://github.com/${repo}.git`;
	const command = `git clone --branch=${branch} --depth 1 ${url} ${destination}`;
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

function copyGitHubParse (repo, destination, force, branch = 'master', useSSH) {
	const url = useSSH ? `git@github.com:${repo}.git` : `https://github.com/${repo}.git`;
	let command;

	shell.exec('git --version', {async: false});
	shell.echo('git version must be 2.25 or higher');

	if (!force && shell.test('-d', destination)) {
		return;
	}
	if (!destination || destination === '.' || destination === '/') {
		throw new Error('invalid destination!');
	}
	const destDir = `src/jsdocs/docs/modules/${destination}`;
	const sourceArray = [];

	if (fs.existsSync(`src/jsdocs/docs/modules/${destination}/.git`)) {
		shell.pushd(destDir);
		command = `git pull origin ${branch}`;
		shell.exec(command, {async: false});
	} else {
		shell.set('+v');
		shell.mkdir('-p', destDir);
		shell.pushd(destDir);
		shell.exec('git init');
		shell.exec('git sparse-checkout init');
		if (destination === 'enact') {
			command = `git sparse-checkout set "*/*/*.js" "*/*/*/*.js" --no-cone`;
		} else {
			command = `git sparse-checkout set "*/*.js" --no-cone`;
		}
		shell.exec(command, {async: false});
		command = `git remote add origin ${url}`;
		shell.exec(command, {async: false});
		command = `git pull origin ${branch}`;
		shell.exec(command, {async: false, silent:false});

		if (destination === 'enact') {
			shell.ls('-d', 'packages/*').forEach(function (dir) {
				if (dir !== 'packages/sampler') {
					sourceArray.push(dir);
				}
			});
			shell.mv(sourceArray, '../.');
			shell.cd('..');
			shell.rm('-rf', 'enact');
		}
	}
	shell.popd();
}

const args = parseArgs(process.argv);
const rebuild = args['rebuild-raw'],
	extraRepos = args['extra-repos'],
	jsdocsCopy = args.jsdocs;

copyGitHub('enactjs/enact', 'raw/enact', rebuild, args['enact-branch'], args['ssh']);
copyGitHub('enactjs/cli', 'raw/cli', rebuild, args['cli-branch'], args['ssh']);
copyGitHub('enactjs/eslint-config-enact', 'raw/eslint-config-enact', rebuild, args['eslint-config-branch'], args['ssh']);
if (jsdocsCopy) {
	copyGitHubParse('enactjs/enact', 'enact', rebuild, args['enact-branch'], args['ssh']);
}

if (extraRepos) {
	const repos = extraRepos.split(',');

	repos.forEach(repo => {
		const [name, branch] = repo.split('#'),
			[, lib] = name.split('/'),
			dest = `raw/${lib}`;

		if (jsdocsCopy) {
			copyGitHubParse(name, lib, rebuild, branch, args['ssh']);
		} else {
			copyGitHub(name, dest, rebuild, branch, args['ssh']);
		}
	});
}
