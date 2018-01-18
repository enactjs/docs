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
						<li><Link to="/about/">About Us</Link></li>
						<li><Link to="/legal/">Legal</Link></li>
						<li><Link to="/contact/">Contact Us</Link></li>
					</ul>
					<ul className={css.social}>
						<li><Link to="https://twitter.com/EnactJS">Twitter</Link></li>
						<li><Link to="https://gitter.im/EnactJS/Lobby">Gitter</Link></li>
					</ul>
					<p className={css.copy}>Copyright &copy; 2017-2018 LG Electronics, Inc.</p>
				</div>
			</footer>
		);
	}
});

export default SiteFooterBase;
export {SiteFooterBase as SiteFooter, SiteFooterBase};
