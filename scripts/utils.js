import shell from 'shelljs';

function errorExit (msg, code = 1) {
	console.error(msg);	// eslint-disable-line no-console
	shell.exit(code);
}


export {errorExit};
