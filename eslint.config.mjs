import enactConfig from 'eslint-config-enact/strict.js';

export default [
	...enactConfig,
	{
		ignores: [
			'.astro/*',
			'.idea/*',
			'dist/*',
			'node_modules/*',
			'public/*',
			'raw/*',
			'src/data',
			'static/*'
		]
	}
];
