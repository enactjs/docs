// SiteFooter
//
import css from './SiteFooter.module.css';

const SiteFooter = ({...rest}) => {
	return (
		<div className={css.footer}>
			<footer  {...rest}>
				<div className={css.frame}>
					<ul className={css.nav}>
						<li><a href="/about/">About Us</a></li>
						<li><a href="/legal/">Legal</a></li>
						<li><a href="/cookie/">Cookie Policy</a></li>
						<li><a href="/contact/">Contact Us</a></li>
						<li><a href="/uses/">Use Cases</a></li>
					</ul>
					<div>
						<ul className={css.social}>
							<li><a href="https://twitter.com/EnactJS">Twitter</a></li>
							<li><a href="https://gitter.im/EnactJS/Lobby">Chat</a></li>
							<li><a href="https://medium.com/enact-js">Blog</a></li>
						</ul>
						<p className={css.copy}>
							Copyright &copy; 2017-{new Date().getFullYear()} LG Electronics
						</p>
					</div>
				</div>
			</footer>
		</div>

	)
}

export default SiteFooter;