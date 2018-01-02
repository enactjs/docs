// SiteFooter
//
import React from 'react';
import {Link} from 'react-router';
import kind from '@enact/core/kind';

import css from './SiteFooter.less';

const SiteFooterBase = kind({
	name: 'SiteFooter',

	styles: {
		css,
		className: 'footer'
	},

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
					<p className={css.copy}>Copyright &copy; LG 2017</p>
				</div>
			</footer>
		);
	}
});

export default SiteFooterBase;
export {SiteFooterBase as SiteFooter, SiteFooterBase};
