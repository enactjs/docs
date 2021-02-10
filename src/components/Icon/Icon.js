import kind from '@enact/core/kind';
import octicons from '@primer/octicons';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Icon.module.less';

// NOTE: We could save some space by directly importing only the
// icon we need instead of all the octicons, but the space savings
// was really small.

const Icon = kind({
	name: 'Icon',
	propTypes: {
		small: PropTypes.bool
	},
	// styles provides automatic className concatenation for an incoming
	// className prop and binds CSS class resolution to the css object
	styles: {
		className: 'icon',
		css
	},
	// Computed props are functions that accept the incoming props
	// to compute new prop values. The key can be a new prop or can
	// override an existing prop.
	computed: {
		// styler is a special, injected prop that aids adding CSS classes
		// from the CSS modules map set in the styles block above. In this
		// case, we're adding the `small` css class to existing className
		// prop and returning in the updated className prop.
		className: ({small, styler}) => styler.append({small})
	},
	render: ({children, ...rest}) => {
		const icon = octicons[children];
		if (!icon) return null;

		delete rest.small;

		return (
			// eslint-disable-next-line react/no-danger
			<span {...rest} dangerouslySetInnerHTML={{__html: icon.toSVG()}} />
		);
	}
});

export default Icon;
export {Icon};
