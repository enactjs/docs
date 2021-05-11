// SiteFooter
//
import kind from '@enact/core/kind';
import {Link} from 'gatsby';
import {Row, Cell} from '@enact/ui/Layout';

import css from './SiteFooter.module.less';

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
						<li><Link to="/uses/">Use Cases</Link></li>
					</ul>
					<Row>
						<Cell component="ul" className={css.social}>
							<li><a href="https://twitter.com/EnactJS">Twitter</a></li>
							<li><a href="https://gitter.im/EnactJS/Lobby">Chat</a></li>
							<li><a href="https://medium.com/enact-js">Blog</a></li>
						</Cell>
						<Cell component="p" className={css.copy}>
							Copyright &copy; 2017-{new Date().getFullYear()} LG Electronics
						</Cell>
					</Row>
				</div>
			</footer>
		);
	}
});

export default SiteFooterBase;
export {SiteFooterBase as SiteFooter, SiteFooterBase};
