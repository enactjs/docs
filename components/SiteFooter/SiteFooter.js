// SiteHeader
//
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
// import {Container, Grid, Span} from 'react-responsive-grid';
// import {prefixLink} from 'gatsby-helpers';
// import includes from 'underscore.string/include';
// import {colors, activeColors} from 'utils/colors';
// import {rhythm, adjustFontSizeTo} from 'utils/typography';
// import {config} from 'config';
import kind from '@enact/core/kind';
// import hoc from '@enact/core/hoc';
// import {Row, Column, Cell} from '@enact/ui/Layout';

import css from './SiteFooter.less';

const SiteFooterBase = kind({
	name: 'SiteFooter',

	// propTypes: {
	// 	compact: PropTypes.bool,
	// 	locationPath: PropTypes.object
	// },

	// defaultProps: {
	// 	compact: false
	// },

	styles: {
		css,
		className: 'footer'// debug'
	},

	// computed: {
	// 	className: ({compact, styler}) => styler.append({compact}),
	// },

	render: ({...rest}) => {
		return (
			<footer {...rest}>
				<div className={css.frame}>
					<ul className={css.nav}>
						<li><Link to="/about">About Us</Link></li>
						<li><Link to="/legal">Legal</Link></li>
						<li><Link to="/contact">Contact Us</Link></li>
					</ul>
					<ul className={css.social}>
						<li>f</li>
						<li>g+</li>
						<li>t</li>
						<li>Li</li>
						<li><i>p</i></li>
					</ul>
					<p className={css.copy}>Copyright &copy;</p>
				</div>
			</footer>
		);
	}
});

export default SiteFooterBase;
export {SiteFooterBase as SiteFooter, SiteFooterBase};
