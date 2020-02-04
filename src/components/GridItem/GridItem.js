// GridItem
//

import {Cell} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import {Link} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import css from './GridItem.module.less';

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

	render: ({children, description, to, version, ...rest}) => (
		<Cell {...rest}>
			<Link to={to}>
				<span className={css.title}>{children}</span>
				<span className={css.version}>{version}</span>
				<span className={css.description}>{description}</span>
			</Link>
		</Cell>
	)
});

export default GridItem;
export {GridItem};
