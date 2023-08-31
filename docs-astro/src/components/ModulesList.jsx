// Modules List
//

import PropTypes from 'prop-types';
import kind from '@enact/core/kind';

import TreeNav from './TreeNav.jsx';
import {linkIsLocation} from '../utils/paths';

const ModulesListBase = kind({
	name: 'ModulesList',

	propTypes: {
		location: PropTypes.object,
		modules: PropTypes.array,
		useFullModulePath: PropTypes.bool
	},

	defaultProps: {
		useFullModulePath: false
	},

	computed: {
		componentDocs: ({modules}) => {
			return modules.filter((page) =>
				page.node.fields.slug.includes('/docs/modules/'));
		}
	},

	render: ({componentDocs, useFullModulePath, location, ...rest}) => {
		const path = location.pathname.replace(/.*\/docs\/modules\//, '').replace(/\/$/, '');
		const pathParts = path.split('/');  // This should really be appended with this: `.join('/' + <wbr />)`, but the string confuses JSX.

		// Build a tree of sections and links
		const tree = [];
		let lastLibrary;
		componentDocs.forEach((section) => {
			const linkText = section.node.fields.slug.replace('/docs/modules/', '').replace(/\/$/, '');
			const library = linkText.split('/')[0];
			const active = (pathParts[0] === library);
			if (library && library !== lastLibrary) {
				lastLibrary = library;

				// Add this section as a node to the tree
				const treeSection = {
					active,
					title: library + ' Library',
					to: section.node.fields.slug
				};

				if (componentDocs.length > 0) {
					const children = [];

					componentDocs.forEach((page) => {
						// Compartmentalize <li>s inside the parent UL
						const subLinkText = page.node.fields.slug.replace('/docs/modules/', '').replace(/\/$/, '');
						const [subLibrary, subDoc = subLibrary] = subLinkText.split('/');
						const activePage = linkIsLocation(page.node.fields.slug, location.pathname);
						if (subLibrary === library) {
							children.push({
								active: activePage,
								title: (useFullModulePath ? subLinkText : subDoc),
								to: page.node.fields.slug
							});
						}
					});

					// Give this section children
					treeSection.children = children;
				}

				tree.push(treeSection);
			}
		});

		delete rest.modules;

		return (
			<TreeNav title="Overview" titleLink="/docs/modules/" tree={tree} {...rest} />
		);
	}
});

export default ModulesListBase;
export {
	ModulesListBase,
	ModulesListBase as ModulesList
};
