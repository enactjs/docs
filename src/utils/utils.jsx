const getModulesPath = (files) => {
	const sortedFiles = files.sort((a, b) => a.id.localeCompare(b.id));

	return sortedFiles.reduce((acc, {filePath}) => {
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
			const order = (await file).frontmatter.sidebar?.order

			return {title, href: withBase(href), order};
		}
	));

	const sortedLinks = formatedLinks.sort((a, b) => {
		if (a.order && b.order) {
			return a.order - b.order;
		}

		return a.title.localeCompare(b.title);
	});

	return sortedLinks.map((link, index) => <a key={index} href={withBase(link.href)}>{link.title}</a>)
};

const withBase = (path, livePreview = false) => {
	path = path.toLowerCase();
	if (process.env.NODE_ENV === 'development' && livePreview) return path

	let normalizedPath = path.startsWith('/') ? path : `/${path}`;
	normalizedPath = normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`;

	if (process.env.NODE_ENV === 'development') return normalizedPath;

	const base = import.meta.env.BASE_URL;
	const normalizedBase = base.endsWith('/') ? base.slice(0, - 1) : base;

	return `${normalizedBase}${livePreview ? path : normalizedPath}`;
};

export {getModulesPath, generateLinks, withBase};
