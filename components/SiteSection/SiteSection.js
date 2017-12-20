// SiteHeader
//
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import css from './SiteSection.less';

// const css = {};

const SiteSectionBase = kind({
	name: 'SiteHeader',

	propTypes: {
		type: PropTypes.oneOf(['emphasize', 'message'])
	},

	defaultProps: {
	},

	styles: {
		css,
		className: 'siteSection'
	},

	// Trick this into being a React.Component
	handlers: {},

	computed: {
		className: ({type, styler}) => styler.append(type)
	},

	render: ({children, ...rest}) => {
		delete rest.type;
		return (
			<section {...rest}>
				<div className={css.frame}>
					{children}
				</div>
			</section>
		);
	}
});

export default SiteSectionBase;
export {SiteSectionBase as SiteSection, SiteSectionBase};
