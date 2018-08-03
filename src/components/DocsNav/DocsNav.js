// DocsNav
//
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import Link from 'gatsby-link';
import {config} from '../../config.js';
import find from 'lodash/find';

import SiteSection from '../SiteSection';
import {linkIsBaseOf} from '../../utils/paths.js';

import css from './DocsNav.less';

const titleFromMetadata = (path, metadata) => {
	const filename = `${path}index.js`;
	const nodes = metadata.filter((edge) => edge.node.fileAbsolutePath.indexOf(filename) >= 0);
	if (nodes.length) {
		return nodes[0].node.frontmatter.title;
	} else {
		return path;
	}
};

const DocsNav = kind({
	name: 'DocsNav',
	propTypes: {
		jsMetadata: PropTypes.array.isRequired,
		location: PropTypes.object.isRequired,
		sitePages: PropTypes.array.isRequired,
		bare: PropTypes.bool  // Should this output normally, or "bare" with just the content and no SiteSection
	},
	defaultProps: {
		bare: false
	},
	styles: {
		css,
		className: 'docsNav covertLinks'
	},
	render: ({bare, className, location, jsMetadata, sitePages, ...rest}) => {

		const childPages = config.docPages.map((p) => {
			const page = find(sitePages, (_p) => _p.node.path === p);
			if (page) {
				return {
					title: page.node.context.title || titleFromMetadata(page.node.path, jsMetadata),
					path: page.node.path
				};
			}
		});

		const docPages = childPages.map((child, index) => {
			if (!child || child.path === '/docs/') return;
			const link = child.path;
			// Ensure we've always got the active section correct. /docs/ being a substr of every category needs special accommodation.
			const isActive = linkIsBaseOf(child.path, location.pathname);
			return (
				<li
					className={isActive ? css.active : null}
					key={index}
				>
					<Link to={link}>
						{child.title}
					</Link>
				</li>
			);
		});

		if (bare) {
			return (
				<ul {...rest} className={className}>
					{docPages}
				</ul>
			);
		}

		return (
			<SiteSection component="nav" {...rest} className={className + ' ' + css.section} accent="Nav">
				<ul>
					{docPages}
				</ul>
			</SiteSection>
		);
	}
});

export default DocsNav;
