// GridItem
//

import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Link} from 'react-router';
import {Cell} from '@enact/ui/Layout';

import css from './GridItem.less';

const GridItem = kind({
	name: 'GridItem',

	propTypes: {
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.node]).isRequired,
		to: PropTypes.string.isRequired,
		description: PropTypes.string
	},

	styles: {
		css,
		className: 'gridItem'
	},

	render: ({children, description, to, ...rest}) => (
		<Cell {...rest}>
			<Link to={to}>
				<span className={css.title}>{children}</span>
				<span className={css.description}>{description}</span>
			</Link>
		</Cell>
	)
});

export default GridItem;
export {GridItem};
