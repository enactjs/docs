// DocsNav
//
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import Link from 'gatsby-link';
import {config} from 'config';
import find from 'lodash/find';

import SiteSection from '../SiteSection';
import {linkIsBaseOf} from '../../utils/paths.js';

import css from './DocsNav.less';

const DocsNav = kind({
	name: 'DocsNav',
	propTypes: {
		location: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired
	},
	styles: {
		css,
		className: 'docsNav covertLinks'
	},
	render: ({location, route, ...rest}) => {

		const childPages = config.docPages.map((p) => {
			const page = find(route.pages, (_p) => _p.path === p && _p != null);
			if (page) {
				return {
					title: page.data.title || page.path,
					path: page.path
				};
			}
		});

		const docPages = childPages.map((child, index) => {
			if (!child || child.path === '/docs/') return;
			const link = child.path;
			// Ensure we've always got the active section correct. /docs/ being a substr of every category needs special accomodation.
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

		return (
			<SiteSection component="nav" {...rest}>
				<ul>
					{docPages}
				</ul>
			</SiteSection>
		);
	}
});

export default DocsNav;
