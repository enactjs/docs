import sampleEmbeds from '../config/sampleEmbeds.json';

const moduleMatches = (moduleName, prefixes) => prefixes.some(
	(prefix) => moduleName === prefix || moduleName.startsWith(`${prefix}/`)
);

const getSampleEmbed = (moduleName) => {
	for (const {title, embed} of sampleEmbeds) {
		if (!embed?.modules?.length || !moduleMatches(moduleName, embed.modules)) {
			continue;
		}

		const route = embed.routes?.[moduleName] ?? '';

		return {
			title,
			src: `${embed.index}${route}`
		};
	}

	return null;
};

export {getSampleEmbed, sampleEmbeds};
