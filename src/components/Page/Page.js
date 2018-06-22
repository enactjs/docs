// Page
//
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import Layout, {Cell} from '@enact/ui/Layout';

// import {linkIsParentOf} from '../../utils/paths.js';
import SiteHeader from '../SiteHeader';
import SiteSection from '../SiteSection';
import SiteFooter from '../SiteFooter';
import DocsNav from '../DocsNav';

import css from './Page.less';
import '../../css/main.less';
import '../../css/github.css';

const PageBase = kind({
	name: 'Page',

	propTypes: {
		data: PropTypes.object.isRequired,
		history: PropTypes.any,
		layout: PropTypes.any,
		layoutContext: PropTypes.any,
		location: PropTypes.object,
		manualLayout: PropTypes.bool,
		match: PropTypes.any,
		page: PropTypes.any,
		pageResources: PropTypes.any,
		pathContext: PropTypes.any,
		staticContext: PropTypes.any,

		title: PropTypes.string
	},

	defaultProps: {
		manualLayout: false
		// title: 'no title - something\'s not right'
	},

	styles: {
		css,
		className: 'page debug layout'
	},

	computed: {
		children: ({children, manualLayout}) => (manualLayout ? children : <SiteSection>{children}</SiteSection>),
		nav: ({nav, data, location}) => {
			if (nav) {
				const docsPages = data.docsPages.edges,
					jsMetadata = data.jsMetadata.edges;
					// padding = (linkIsParentOf('/docs/modules/', location.pathname) ?
					// 	null : '1em 0'
					// );
					// <Page style={{padding: padding}}>
					// </Page>

				return (
					<Cell shrink>
						<DocsNav location={location} sitePages={docsPages} jsMetadata={jsMetadata} />
					</Cell>
				);
			}
		},
		title: ({title, data}) => (title || (data && data.site.siteMetadata.title) || 'noData')
	},

	render: ({children, location, nav, title, ...rest}) => {
		delete rest.data;
		delete rest.history;
		delete rest.layout;
		delete rest.layoutContext;
		// delete rest.location;
		delete rest.manualLayout;
		delete rest.match;
		delete rest.page;
		delete rest.pageResources;
		delete rest.pathContext;
		delete rest.staticContext;

		console.log('Page props:', rest);
		return (
			<Layout orientation="vertical" style={{height: '100vh'}}>
				<Cell
					shrink
					component={SiteHeader}
					location={location}
					title={title}
				/>
				{nav}
				<Cell component="article" {...rest}>
					<div className={css.contentFrame}>
						<div className={css.content}>
							{children}
						</div>
						<SiteFooter />
					</div>
				</Cell>
			</Layout>
		);
	}
});

export default PageBase;
export {PageBase as Page, PageBase};
