const enactConfig = require('eslint-config-enact/strict');

module.exports = [
	...enactConfig,
	{
		ignores: [
			'public/*',
			'raw/*',
			'dist/*',
			'node_modules/*',
			'static/*',
			'src/html.js'
		]
	}
];
