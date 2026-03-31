const enactConfig = require('eslint-config-enact/strict');

module.exports = [
	...enactConfig,
	{
		ignores: [
			'build/*',
			'docs/**',
			'raw/*',
			'dist/*',
			'node_modules/*',
			'static/*',
			'.cache/*',
			'src/html.js'
		]
	}
];
