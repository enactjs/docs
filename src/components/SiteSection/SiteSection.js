// SiteSection
//
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';

import css from './SiteSection.module.less';

const SiteSectionBase = kind({
	name: 'SiteSection',

	propTypes: {
		accent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

		/**
		 * The type of component to use to render as the SiteSection. May be a DOM node name (e.g
		 * 'div', 'span', etc.) or a custom component.
		 *
		 * @type {String|Node}
		 * @default 'section'
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		fullHeight: PropTypes.bool
	},

	defaultProps: {
		component: 'section',
		fullHeight: false
	},

	styles: {
		css,
		className: 'siteSection'
	},

	computed: {
		className: ({accent, fullHeight, styler}) => styler.append(accent ? ('accent' + accent) : null, {fullHeight})
	},

	render: ({children, component: Component, ...rest}) => {
		delete rest.accent;
		delete rest.fullHeight;
		return (
			<Component {...rest}>
				<div className={css.frame}>
					{children}
				</div>
			</Component>
		);
	}
});

export default SiteSectionBase;
export {SiteSectionBase as SiteSection, SiteSectionBase};
