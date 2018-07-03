import React from 'react';
import PropTypes from 'prop-types';

import Page from '../components/Page';

export default class IndexLayout extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		children: PropTypes.func
	}

	render () {
		const {children, ...rest} = this.props;
		return (
			<Page
				// title={rest.data.site.siteMetadata.title}
				nav
				{...rest}
			>
				{children()}
			</Page>
		);
	}
}

export const query = graphql`
	query DocsIndexQuery {
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

		jsMetadata: allJavascriptFrontmatter (
			filter:{
				fields:{
					slug: {regex: "/docs\\//"}
				}
			}
		) {
			edges{
				node{
					fields {
						slug
					}
					fileAbsolutePath
					frontmatter {
						title
					}
				}
			}
		}
	}
`;

