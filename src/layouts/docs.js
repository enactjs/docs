import React from 'react';
import PropTypes from 'prop-types';

import {linkIsParentOf} from '../utils/paths.js';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import SiteSection from '../components/SiteSection';
import DocsNav from '../components/DocsNav';

import '../css/main.less';

// Import styles.
import '../css/github.css';

export default class SiteTemplate extends React.Component {
	static propTypes = {
		children: PropTypes.func,
		data: PropTypes.object,
		location: PropTypes.object
	}

	// <SiteSection accent="1">
	// 	<p>Some body crap</p>
	// </SiteSection>
	// <Container
	// 	className={css.article}
	// style={{
	// 	// maxWidth: 960,
	// 	// padding: `${rhythm(1)} ${rhythm(3 / 4)}`,
	// 	// paddingTop: 0,
	// 	// position: 'relative'
	// }}
	// >
	// </Container>
	render () {
		const docsPages = this.props.data.docsPages.edges,
			jsMetadata = this.props.data.jsMetadata.edges,
			padding = (linkIsParentOf('/docs/modules/', this.props.location.pathname) ?
				null : '1em 0'
			);

		return (
			<div>
				<SiteHeader
					location={this.props.location}
					title={this.props.data.site.siteMetadata.title}
				/>
				<DocsNav location={this.props.location} sitePages={docsPages} jsMetadata={jsMetadata} />
				<SiteSection style={{padding: padding}}>
					{this.props.children()}
				</SiteSection>
				<SiteFooter />
			</div>
		);
	}
}

export const query = graphql`
	query DocsLayoutQuery {
		site {
			siteMetadata {
				title
			}
		}

		docsPages: allSitePage(
			filter:{
				path:{regex: "/\/docs/"}
			}
		) {
			edges {
				node {
					path
					context{
						title
					}
				}
			}
		}

		jsMetadata: allJavascriptFrontmatter {
			edges{
				node{
					fileAbsolutePath
					frontmatter {
						title
					}
				}
			}
		}
	}
`;

