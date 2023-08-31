// Type
//
import {Cell} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import {Link} from './Link';
import PropTypes from 'prop-types';

import css from './CellLink.module.less';

const CellLink = kind({
	name: 'CellLink',
	propTypes: {
		children: PropTypes.string,
		to: PropTypes.string
	},
	styles: {
		css,
		className: 'cell'
	},
	render: ({to, children, ...rest}) => (
		<Cell size="50%" component={Link} to={to} {...rest}>{children}</Cell>
	)
});

export default CellLink;
export {CellLink};
