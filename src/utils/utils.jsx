const getModulesPath = (files) => {
	return files.reduce((acc, path) => {
		const parts = path.split('/');
		const folder = parts.at(-2);

		if (!acc[folder] && folder !== 'modules') {
			const firstFileHref = path
				.replace('/src/content/docs/', '')
				.replace(/\.mdx?$/, '').replace('$', '').toLocaleLowerCase();

			acc[folder] = {
				name: folder,
				modulePath: `/${firstFileHref}`
			};
		}

		return acc;
	}, {});
};

const generateLinks = async ({paths, files}) => {
	const formatedLinks = await Promise.all(paths.map(async (path) => {
			const file = await files[path]();
			const href = path
				.replace('/src/content/docs', '')
				.replace(/(index)?\.mdx?$/, '');
			const title = (await file).frontmatter.title || href;

			return {title, href};
		}
	));

	const sortedLinks = formatedLinks.sort((a, b) => a.title.localeCompare(b.title));

	return sortedLinks.map((link, index) => <a key={index} href={link.href}>{link.title}</a>)
}

const withBase = (path) => {
	const base = import.meta.env.BASE_URL;
	const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

	return `${base}${normalizedPath}`;
};

export {getModulesPath, generateLinks, withBase};