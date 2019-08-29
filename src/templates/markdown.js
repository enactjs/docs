/* eslint-disable react/no-danger */
import { graphql } from 'gatsby';

import PropTypes from 'prop-types';
import React from 'react';

import EditContent from '../components/EditContent';
import {linkIsParentOf} from '../utils/paths';
import Page from '../components/Page';
import SiteSection from '../components/SiteSection';
import SiteTitle from '../components/SiteTitle';
import TOCList from '../components/TOCList';

import css from '../css/main.module.less';

class MarkdownPage extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render () {
		const post = this.props.data.markdownRemark;
		const isDocsPage = linkIsParentOf('/docs/', this.props.location.pathname);
		const description = post.frontmatter.description || `Enact documentation: ${post.frontmatter.title}`;

		const markdown =
			<SiteTitle {...this.props}>
				<div className={css.markdown}>
					<EditContent>
						{post.frontmatter.github}
					</EditContent>
					<h1>{post.frontmatter.title}</h1>
					<div dangerouslySetInnerHTML={{__html: post.html}} />
				</div>
			</SiteTitle>;

		if (isDocsPage) {
			return (
				<Page
					description={description}
					nav
					{...this.props}
				>
					<sidebar>
						<TOCList
							modules={this.props.data.allMarkdownRemark.edges}
							location={this.props.location}
						/>
					</sidebar>
					{markdown}
				</Page>
			);
		} else {
			return (
				<Page {...this.props}>
					<SiteSection>
						{markdown}
					</SiteSection>
				</Page>
			);
		}
	}
}

export default MarkdownPage;

export const pageQuery = graphql`
	query markdownQuery($slug: String!, $parentRegex: String) {
		markdownRemark(fields: {slug: {eq: $slug } }) {
			html
			frontmatter {
				title
				github
			}
		}
		allMarkdownRemark(
			filter: {
				fields: {
					slug: {regex: $parentRegex }
				}
			},
			sort: {
				fields: [frontmatter___order, frontmatter___title],
				order: ASC
			}
		) {
			edges {
				node {
					fields {
						slug
					}
					frontmatter {
						title
					}
				}
			}
		}
		# For Page
		site {
			siteMetadata {
				title
			}
		}
		# For NavBar (in Page)
		docsPages: allSitePage(
			filter:{
				path:{regex: "/\/docs\/[^/]*\/$/"}
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
		# For NavBar
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
`;
