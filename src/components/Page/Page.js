// Page
//
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import Layout, {Cell} from '@enact/ui/Layout';

import {linkIsParentOf} from '../../utils/paths.js';
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

		// Ours
		scrolled: PropTypes.bool,

		// Ours
		scrollerRef: PropTypes.func,

		staticContext: PropTypes.any,
		// Ours
		title: PropTypes.string
	},

	defaultProps: {
		manualLayout: false,
		scrolled: false
		// title: 'no title - something\'s not right'
	},

	styles: {
		css,
		className: 'page debug layout'
	},

	computed: {
		children: ({children, manualLayout}) => (manualLayout ? children : <SiteSection>{children}</SiteSection>),
		contentStyle: ({location}) => {
			return {padding: (linkIsParentOf('/docs/modules/', location.pathname) ?
				null : '1em 0'
			)};
		},
		nav: ({nav, data, location}) => {
			if (nav) {
				const docsPages = data.docsPages.edges,
					jsMetadata = data.jsMetadata.edges;

				return (
					<Cell shrink>
						<DocsNav location={location} sitePages={docsPages} jsMetadata={jsMetadata} />
					</Cell>
				);
			}
		},
		title: ({title, data}) => (title || (data && data.site.siteMetadata.title) || 'noData')
	},

	render: ({children, scrolled, contentStyle, location, nav, scrollerRef, title, ...rest}) => {
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

		return (
			<Layout orientation="vertical" style={{height: '100vh'}}>
				<Cell
					shrink
					compact={scrolled}
					component={SiteHeader}
					location={location}
					title={title}
				/>
				{nav}
				<Cell component="article" {...rest}>
					<div className={css.contentFrame} ref={scrollerRef}>
						<div className={css.content} style={contentStyle}>
							{children}
						</div>
						<SiteFooter />
					</div>
				</Cell>
			</Layout>
		);
	}
});

const ScrollDetector = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'ScrollDetector'

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
			if (ev.srcElement.scrollingElement.scrollTop != null) scrollTop = ev.srcElement.scrollingElement.scrollTop;
			// Account for normal DOM nodes
			else scrollTop = ev.srcElement.scrollTop;

			this.setState({scrolled: (scrollTop !== 0)});
		}

		setNode = (node) => {
			this.node = ReactDOM.findDOMNode(node);	// eslint-disable-line react/no-find-dom-node
		}

		render () {
			let props = this.props;

			return (
				<Wrapped scrolled={this.state.scrolled} {...props} scrollerRef={this.setNode} />
			);
		}
	};

});

const Page = ScrollDetector(PageBase);

export default Page;
export {Page, PageBase};
