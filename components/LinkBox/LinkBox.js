// Type
//
import React from 'react';
// import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import {Link} from 'react-router';
import {prefixLink} from 'gatsby-helpers';

import css from './LinkBox.less';

const LinkBox = kind({
	name: 'LinkBox',
	propTypes: {
		children: React.PropTypes.node,
		iconAlt: React.PropTypes.string,
		iconSrc: React.PropTypes.string,
		title: React.PropTypes.string
	},
	styles: {
		css,
		className: 'linkBox'
	},
	render: ({children, iconAlt, iconSrc, title, ...rest}) => (
		<Row align="center" component="section" {...rest}>
			<Cell size={210} className={css.image} shrink>
				<img alt={iconAlt} src={iconSrc} /><br />
				{title}
			</Cell>
			<Cell>
				<Row wrap className={css.content}>
					{children}
				</Row>
			</Cell>
		</Row>
	)
});

const CellLink = kind({
	name: 'CellLink',
	propTypes: {
		children: React.PropTypes.string,
		to: React.PropTypes.string
	},
	styles: {
		css,
		className: 'cell'
	},
	render: ({to, children, ...rest}) => (
		<Cell size="50%" component={Link} to={to} {...rest}>{children}</Cell>
	)
});

export default LinkBox;
export {LinkBox, CellLink};
