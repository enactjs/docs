import {withBase} from '@utils';

const filterSidebarEntries = (sidebar, label) => {
	const items = sidebar.find((entry) => entry.label === label);

	if (!items) return [];

	const getFirstLink = (entry) => {
		if (!entry) return null;

		if (entry.type === 'link') {
			return entry;
		}

		if (entry.type === 'group' && Array.isArray(entry.entries)) {
			for (const child of entry.entries) {
				const found = getFirstLink(child);
				if (found) return found;
			}
		}

		return null;
	};

	const customSort = (a, b) => {
		const aStartsUpper = a.label[0] === a.label[0].toUpperCase();
		const bStartsUpper = b.label[0] === b.label[0].toUpperCase();

		if (aStartsUpper !== bStartsUpper) {
			return aStartsUpper ? -1 : 1;
		}

		return a.label.localeCompare(b.label);
	};

	const filteredEntries = items?.entries
		.map(getFirstLink)
		.filter(Boolean)
		.sort(customSort);

	return [{...items, entries: filteredEntries}];
};

const filterSidebarBySubfolder = (sidebar, id, baseRoute, sectionLabel) => {
	const extractSubfolderFromPath = (route) => {
		const pathParts = id.split('/').filter(Boolean).filter((p) => p !== 'docs');
		const baseIndex = pathParts.indexOf(route);

		if (baseIndex === -1 || baseIndex === pathParts.length - 1) return null;

		return pathParts[baseIndex + 1];
	};

	const subfolder = extractSubfolderFromPath(baseRoute);

	if (!subfolder) return [];

	const section = sidebar.find(entry => entry.label === sectionLabel);
	if (!section || !section.entries) return [];

	const findGroupByPath = (entries, pathToMatch) => {
		for (const entry of entries) {
			if (entry.type === 'group' && entry.entries) {
				const hasMatchingChild = entry.entries.some(child =>
					child.href && child.href.includes(pathToMatch)
				);

				if (hasMatchingChild) {
					return entry;
				}

				const found = findGroupByPath(entry.entries, pathToMatch);
				if (found) return {...found, label: subfolder};
			}
		}
		return null;
	};

	const matchedGroup = findGroupByPath(section.entries, subfolder);
	return matchedGroup ? [matchedGroup] : [];
};

const addBackToTutorialsLink = (sidebar, tutorialPath, label) => {
	const sublist = sidebar.filter(entry => entry.label === label);

	if (!sublist || sublist.length === 0) return sublist;

	return sublist.map(section => ({
		...section,
		entries: [
			{
				type: 'link',
				label: `← ${label}`,
				href: withBase(tutorialPath),
				attrs: {}
			},
			...section.entries
		]
	}));
};

const addArrowToFirstLink = (sublist) => {
	if (!sublist || sublist.length === 0) return sublist;

	return sublist.map((section) => {
		if (section.entries && section.entries.length > 0) {
			section.entries[0].label = `← ${section.entries[0].label}`;
		}
	});
};

export {
	addArrowToFirstLink,
	addBackToTutorialsLink,
	filterSidebarBySubfolder,
	filterSidebarEntries
};
