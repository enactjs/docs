// Type
//
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Cell, Layout, Row} from '@enact/ui/Layout';
import Link from 'gatsby-link';

import css from './LinkBox.module.less';

const LinkBox = kind({
	name: 'LinkBox',
	propTypes: {
		children: PropTypes.node,
		iconAlt: PropTypes.string,
		iconSrc: PropTypes.string,
		orientation: PropTypes.string,
		title: PropTypes.string
	},
	styles: {
		css,
		className: 'linkBox'
	},
	render: ({children, iconAlt, iconSrc, orientation, title, ...rest}) => {
		return (
			<Row align="center" component="section" {...rest}>
				<div className={css.image}>
					<img alt={iconAlt} src={iconSrc} /><br />
					{title}
				</div>
				<div className={css.contentCell}>
					<Layout wrap className={css.content} orientation={orientation}>
						{children}
					</Layout>
				</div>
			</Row>
		);
	}
});

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

export default LinkBox;
export {LinkBox, CellLink};
