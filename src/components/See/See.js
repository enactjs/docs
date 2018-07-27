// Type
//
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import SmartLink from '../SmartLink';

import css from './See.less';

const See = kind({
	name: 'See',

	propTypes: {
		tag: PropTypes.object.isRequired
	},

	styles: {
		css,
		className: 'see'
	},

	render: (props) => {
		return <SmartLink prefix="See: " {...props} />;
	}
});

export default See;
export {See};
