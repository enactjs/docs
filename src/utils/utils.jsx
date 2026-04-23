const getModulesPath = (files) => {
	return files.reduce((acc, {filePath}) => {
		const parts = filePath.split('/');
		const folder = parts.at(-2);

		if (!acc[folder] && folder !== 'modules') {
			const firstFileHref = filePath
				.replace('src/content/docs/', '')
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
};

const withBase = (path) => {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;

	if (process.env.NODE_ENV === 'development') return normalizedPath;

	const base = import.meta.env.BASE_URL;
	const cleanPath = normalizedPath.slice(1);
	const normalizedBase = base.endsWith('/') ? base : `${base}/`;

	return `${normalizedBase}${cleanPath}`;
};

export {getModulesPath, generateLinks, withBase};