// Type
//
import {Cell} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

const Link = kind({
	name: 'Link',
	propTypes: {
		children: PropTypes.string,
		to: PropTypes.string
	},
	render: ({to, children, ...rest}) => (
		<a size="50%" href={to} {...rest}>{children}</a>
	)
});

export default Link;
export {Link}
