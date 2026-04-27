/* eslint-env node */
'use strict';

const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const examplesDir = path.join(publicDir, 'examples');
const examplesIndex = path.join(examplesDir, 'index.html');

if (!fs.existsSync(publicDir)) {
	console.error('Missing public directory. Run build-public first.'); // eslint-disable-line no-console
	process.exit(1);
}

if (!fs.existsSync(examplesIndex)) {
	fs.mkdirSync(examplesDir, {recursive: true});
	fs.writeFileSync(
		examplesIndex,
		'<!doctype html><html><head><meta charset="utf-8"><title>Examples</title></head><body></body></html>\n',
		'utf8'
	);
	console.log('Created legacy file: public/examples/index.html'); // eslint-disable-line no-console
}
