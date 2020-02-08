// DocsNav
//
import find from 'lodash/find';
import kind from '@enact/core/kind';
import {Link} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import {config} from '../../config.js';
import {linkIsBaseOf} from '../../utils/paths.js';
import SiteSection from '../SiteSection';

import css from './DocsNav.module.less';

const pageMetadata = (path, metadata) => {
	const filename = `${path}index.js`;
	const nodes = metadata.filter((edge) => edge.node.fileAbsolutePath.indexOf(filename) >= 0);
	if (nodes.length) {
		return {
			title: nodes[0].node.frontmatter.title,
			description: nodes[0].node.frontmatter.description
		};
	} else {
		return {title: path};
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
				const {title, description} = pageMetadata(page.node.path, jsMetadata);
				return {
					title: page.node.context.title || title,
					path: page.node.path,
					description
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
					<Link to={link} title={child.description}>
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
