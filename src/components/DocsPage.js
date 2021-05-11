import {StaticQuery, graphql} from 'gatsby';

import Page from './Page';

// eslint-disable-next-line enact/prop-types, enact/display-name
export default ({children, location}) => (
	<StaticQuery
		query={graphql`
			{
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
							slug: {regex: "/docs\\/[^/]*\\/$/"}
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
								description
								title
							}
						}
					}
				}
			}
		`}
		// eslint-disable-next-line react/jsx-no-bind
		render={data => (
			<Page nav location={location} data={data}>
				{children}
			</Page>
		)}
	/>
);
