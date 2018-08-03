import data from './data/docVersion.json';
const {docVersion} = data;

export default {
	config: {
		siteTitle: 'Enact',
		linkPrefix: '/public',
		baseColor: '#1b5271',
		docPages: [
			'/docs/',
			'/docs/modules/',
			'/docs/developer-guide/',
			'/docs/developer-tools/',
			'/docs/tutorials/'
		],
		docVersion
	}
};
