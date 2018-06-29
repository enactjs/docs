// Table of Contents List
//
// TODO: We can use the metadata fields in the `.js` and `.md` files and pull them out of the
// `data` member of the page list.  We'll need to separate out the sections into an array of
// objects, sorted by the sort order.  Then, we can loop through and output them.  Given how
// different this is from the module list, we probably don't want to unify them at this time.
// However, we might could if we were to pass in the data instead of inferring from the route.

import React from 'react';
import PropTypes from 'prop-types';
// import Link from 'gatsby-link';
import kind from '@enact/core/kind';

import TreeNav from '../TreeNav';
import {linkIsLocation} from '../../utils/paths';

function baseDocPath (path) {
	if (path.indexOf('/docs/') !== 0) {
		return '';
	}
	const parts = path.split('/');
	if (parts.length < 4) {
		return '';
	}
	return (`/docs/${parts[2]}/`);
}

const TOCListBase = kind({
	name: 'TOCList',

	propTypes: {
		location: PropTypes.object,
		modules: PropTypes.array
	},

	render: ({modules, location, ...rest}) => {
		// The top level section in the docs.  (e.g. tutorials)
		const sourcePath = baseDocPath(location.pathname);

		// Abort if we're not in a docs sub-level
		if (!sourcePath || sourcePath === '/docs/modules/') {
			return (null);
		}

		// Gather all pages below the top level section
		const subPages = modules.filter((page) =>
			page.node.fields.slug.includes(sourcePath));

		// Gather all the first level headings in the subPages (e.g. Kitten Browser)
		const sections = subPages.reduce((acc, page) => {
			const pathParts = page.node.fields.slug.replace(sourcePath, '').split('/');

			if (pathParts.length === 2) {	// Two, because trailing slash
				acc.push(page);
			}
			return acc;
		}, []);

		// Build a tree of sections and links
		const tree = [];
		sections.forEach((section) => {
			const linkText = section.node.frontmatter.title;
			const sectionLocation = section.node.fields.slug;
			const active = location.pathname.indexOf(sectionLocation) === 0;

			const treeSection = {
				active,
				title: linkText,
				to: sectionLocation
			};

			if (subPages.length > 0) {
				const children = [];

				subPages.forEach((page) => {
					// Compartmentalize <li>s inside the parent UL
					const subLinkText = page.node.frontmatter.title;
					const subPageLocation = page.node.fields.slug;
					const activePage = linkIsLocation(subPageLocation, location.pathname);
					if (subPageLocation !== sectionLocation && subPageLocation.indexOf(sectionLocation) === 0) {
						children.push({
							title: subLinkText,
							active: activePage,
							to: subPageLocation
						});
					}
				});

				treeSection.children = children;
			}

			tree.push(treeSection);
		});

		return (
			<TreeNav title="Overview" tree={tree} {...rest} />
		);
	}
});

export default TOCListBase;
export {
	TOCListBase,
	TOCListBase as TOCList
};
