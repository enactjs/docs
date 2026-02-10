import {SiteFooter, SiteSection, SiteTitle} from '../index';

import css from './Page.module.css';
import '../../css/main.module.css';

const Page = ({children, description = 'Enact JavaScript Framework', ...rest}) => {
	return (
		<div style={{height: '100vh'}}>
			<SiteTitle>
				<html lang="en" />
				<meta name="google-site-verification" content="s84i1v-XsTeUCDI6kHSFImfq64FLjoByfGECA-PxoPI" />
				<meta name="description" content={description} />
			</SiteTitle>
			{/*{nav ? <Cell shrink className={css.headerNav}>*/}
			{/*	{sidebar ? <div className={css.hamburgerMenuIcon} onClick={toggleSidebar}><Icon small>grabber</Icon></div> : null}*/}
				{/*<DocsNav {...navProps} />*/}
			{/*</Cell> : null}*/}
			<article {...rest}>
				<div className={css.contentFrame}>
					<div className={css.content}>
						{children}
					</div>
					<SiteFooter />
				</div>
			</article>
		</div>
	)
}

export default Page;