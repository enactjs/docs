import {StaticQuery, graphql} from 'gatsby';
import React from 'react';

import Page from './Page';

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
		render={data => (
			<Page nav location={location} data={data}>
				{children}
			</Page>
		)}
	/>
);
