// SiteSection
//
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';

import css from './SiteSection.less';

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
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
	},

	defaultProps: {
		component: 'section'
	},

	styles: {
		css,
		className: 'siteSection'
	},

	computed: {
		className: ({accent, styler}) => styler.append(accent ? ('accent' + accent) : null)
	},

	render: ({children, component: Component, ...rest}) => {
		delete rest.accent;
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
