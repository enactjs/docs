import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import {config} from '../../config';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';

import {LinkBox, CellLink} from '../../components/LinkBox';
import Page from '../../components/Page';
import SiteSection from '../../components/SiteSection';

import css from './index.less';

export const frontmatter = {
	title: 'Getting Started'
};

const IndexBase = kind({
	name: 'GettingStarted',
	propTypes: {
		data: PropTypes.object,
		location: PropTypes.object
	},
	styles: {
		css,
		className: 'gettingStarted covertLinks'
	},
	computed: {
		guidesList: ({data}) => data.guidesList.edges,
		modulesList: ({data}) => {
			const modules = data.modulesList.edges;
			const libraries = [];
			let lastLibrary;
			modules.map((edge) => {
				const linkText = edge.node.fields.slug.replace('/docs/modules/', '').replace(/\/$/, '');
				const library = linkText.split('/')[0];
				if (library && library !== lastLibrary) {
					// console.log('library:', library, lastLibrary);
					lastLibrary = library;
					libraries.push({title: library, path: edge.node.fields.slug});
				}
			});
			return libraries;
		},
		toolsList: ({data}) => data.toolsList.edges,
		tutorialsList: ({data}) => data.tutorialsList.edges
	},
	render: ({guidesList, modulesList, toolsList, tutorialsList, ...rest}) => {
		return (<DocumentTitle title={config.siteTitle}>
			<Page {...rest} manualLayout>
				<SiteSection accent="2">
					<Row align="center" component="section" className={css.hero} wrap>
						<Cell size={100} className={css.image} shrink>
							<img alt="Cute animated getting ready image" src="images/getting-started.svg" /><br />
						</Cell>
						<Cell size="70%" className={css.content}>
							<h1>Developer Documentation</h1>
							<p>Documentation for Enact falls into several categories:  Tutorials, Libraries (API) Documentation, Developer Guides and Tools.</p>
						</Cell>
					</Row>
				</SiteSection>

				<SiteSection>
					<LinkBox
						iconAlt="Icon of a magnifying glass looking at the cover of a book"
						iconSrc="images/tutorials.svg"
						orientation="vertical"
						title="Tutorials"
					>
						{tutorialsList.map((edge, index) =>
							<CellLink key={index} to={edge.node.fields.slug}>{edge.node.frontmatter.title}</CellLink>
						)}
					</LinkBox>

					<hr />

					<LinkBox
						iconAlt="Icon of a stack of building blocks"
						iconSrc="images/modules.svg"
						title="Libraries"
					>
						{modulesList.map((page, index) =>
							<CellLink key={index} to={page.path}>{page.title}</CellLink>
						)}
					</LinkBox>

					<hr />

					<LinkBox
						iconAlt="Icon of a placemark pinpointing a spot in an open book"
						iconSrc="images/guide.svg"
						title="Developer Guide"
					>
						{guidesList.map((edge, index) =>
							<CellLink key={index} to={edge.node.fields.slug}>{edge.node.frontmatter.title}</CellLink>
						)}
					</LinkBox>

					<hr />

					<LinkBox
						iconAlt="Icon of a book being worked on with a wrench"
						iconSrc="images/devtools.svg"
						title="Developer Tools"
					>
						{toolsList.map((edge, index) =>
							<CellLink key={index} to={edge.node.fields.slug}>{edge.node.frontmatter.title}</CellLink>
						)}
					</LinkBox>
				</SiteSection>
			</Page>
		</DocumentTitle>);
	}
});

export const pageQuery = graphql`
	query mardownQuery {
		guidesList: allMarkdownRemark(
			filter:{
				fields:{
					slug: {regex: "/docs\\/developer-guide\\/[^/]*\/$/"}
				}
			}
		) {
			...pageFields
		}
		modulesList: allJsonDoc(sort: {fields: [fields___slug], order: ASC}) {
			edges {
				node {
					fields {
						slug
					}
				}
			}
		}
		toolsList: allMarkdownRemark(
			filter:{
				fields:{
					slug: {regex: "/docs\\/developer-tools\\/[^/]*\/$/"}
				}
			}
		) {
			...pageFields
		}
		tutorialsList: allMarkdownRemark(
			filter:{
				fields:{
					slug: {regex: "/docs\\/tutorials\\/[^/]*\/$/"}
				}
			}
		) {
			...pageFields
		}
	}

	fragment pageFields on MarkdownRemarkConnection {
		edges {
			node {
				fields{
					slug
				}
				frontmatter {
					title
				}
			}
		}
	}
`;

export default IndexBase;
