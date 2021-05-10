// Page
//
import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Helmet} from 'react-helmet';
import hoc from '@enact/core/hoc';
import Slottable from '@enact/ui/Slottable';
import Toggleable from '@enact/ui/Toggleable';
import Layout, {Cell} from '@enact/ui/Layout';

import Icon from '../Icon';
import SiteHeader from '../SiteHeader';
import SiteSection from '../SiteSection';
import SiteFooter from '../SiteFooter';
import DocsNav from '../DocsNav';

import css from './Page.module.less';
import '../../css/main.module.less';
import '../../css/github.css';

const PageBase = kind({
	name: 'Page',

	propTypes: {
		data: PropTypes.object,
		description: PropTypes.string,
		location: PropTypes.object,
		match: PropTypes.any,

		// Ours
		nav: PropTypes.bool,  // Whether the header navigation is available
		navigate: PropTypes.any,

		page: PropTypes.any,
		pageContext: PropTypes.any,
		pageResources: PropTypes.any,
		pathContext: PropTypes.any,

		// Ours
		scrolled: PropTypes.bool,

		// Ours
		scrollerRef: PropTypes.func,

		// Ours
		sidebar: PropTypes.any,
		sidebarShown: PropTypes.bool,

		staticContext: PropTypes.any,
		// Ours
		title: PropTypes.string,
		toggleSidebar: PropTypes.func  // function that should toggle the sidebar
	},

	defaultProps: {
		description: 'Enact JavaScript Framework',
		scrolled: false,
		sidebar: false
		// title: 'no title - something\'s not right'
	},

	styles: {
		css,
		className: 'page'
	},

	computed: {
		navProps: ({nav, data, location}) => {
			if (nav) {
				return {
					className: css.nav,
					sitePages: data.docsPages.edges,
					jsMetadata: data.jsMetadata.edges,
					location
				};
			}
		},
		// TODO: Clean up site metadata to be local StaticQuery
		title: ({title, data}) => (title || (data && data.site && data.site.siteMetadata.title) || 'Enact')
	},

	render: ({children, description, scrolled, sidebar, location, nav, navProps, scrollerRef, sidebarShown, title, toggleSidebar, ...rest}) => {
		delete rest.data;
		delete rest.match;
		delete rest.navigate;
		delete rest.page;
		delete rest.pageResources;
		delete rest.pageContext;
		delete rest.pathContext;
		delete rest.staticContext;

		return (
			<Layout orientation="vertical" style={{height: '100vh'}}>
				<Cell
					shrink
					compact={scrolled}
					component={SiteHeader}
					location={location}
					title={title}
				/>
				<Helmet>
					<html lang="en" />
					<meta name="google-site-verification" content="s84i1v-XsTeUCDI6kHSFImfq64FLjoByfGECA-PxoPI" />
					<meta name="description" content={description} />
				</Helmet>
				{nav ? <Cell shrink className={css.headerNav}>
					{sidebar ? <div className={css.hamburgerMenuIcon} onClick={toggleSidebar}><Icon small>grabber</Icon></div> : null}
					<DocsNav {...navProps} />
				</Cell> : null}
				<Cell component="article" {...rest}>
					<div className={css.contentFrame} ref={scrollerRef}>
						<div className={css.content}>
							{sidebar ?
								<SiteSection fullHeight>
									<Layout className={css.multiColumn}>
										<Cell component="nav" size={198} className={css.sidebarColumn + (sidebarShown ? ' ' + css.active : '')}>
											<div className={css.hamburgerMenuIcon} onClick={toggleSidebar}><Icon small>grabber</Icon></div>
											{nav ? <DocsNav bare {...navProps} /> : null}
											{sidebar}
										</Cell>
										<Cell className={css.bodyColumn}>
											{children}
										</Cell>
									</Layout>
								</SiteSection> :
								children
							}
						</div>
						<SiteFooter />
					</div>
				</Cell>
			</Layout>
		);
	}
});

const ScrollDetector = hoc((configHoc, Wrapped) => {
	return class extends Component {
		static displayName = 'ScrollDetector';

		constructor (props) {
			super(props);

			this.state = {
				scrolled: false		// true only when the element has scrolled away from the very top
			};
		}

		componentDidMount () {
			if (this.node) this.node.addEventListener('scroll', this.handleScroll);
		}

		componentWillUnmount () {
			if (this.node) this.node.removeEventListener('scroll', this.handleScroll);
		}

		handleScroll = (ev) => {
			let scrollTop = 0;
			// Account for `body`
			if (ev.srcElement.scrollingElement && ev.srcElement.scrollingElement.scrollTop != null) scrollTop = ev.srcElement.scrollingElement.scrollTop;
			// Account for normal DOM nodes
			else scrollTop = ev.srcElement.scrollTop;

			this.setState({scrolled: (scrollTop !== 0)});
		};

		setNode = (node) => {
			this.node = ReactDOM.findDOMNode(node);	// eslint-disable-line react/no-find-dom-node
		};

		render () {
			let props = this.props;

			return (
				<Wrapped scrolled={this.state.scrolled} {...props} scrollerRef={this.setNode} />
			);
		}
	};

});

const Page = Toggleable(
	{
		toggleProp: 'toggleSidebar',
		prop: 'sidebarShown'
	},
	ScrollDetector(
		Slottable(
			{
				slots: ['sidebar']
			},
			PageBase
		)
	)
);

export default Page;
export {Page, PageBase};
