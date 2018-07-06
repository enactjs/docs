import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';

import SiteTitle from '../../components/SiteTitle';
import {LinkBox, CellLink} from '../../components/LinkBox';
import SiteSection from '../../components/SiteSection';

import css from './index.less';

// images
import devTools from './images/devtools.svg';
import gettingStarted from './images/getting-started.svg';
import guide from './images/guide.svg';
import modules from './images/modules.svg';
import tutorials from './images/tutorials.svg';

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
			const modulesList = data.modulesList.edges;
			const libraries = [];
			let lastLibrary;
			modulesList.map((edge) => {
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

	render: ({className, guidesList, modulesList, toolsList, tutorialsList, ...rest}) => {
		return (<SiteTitle {...rest} title={frontmatter.title}>
			<div className={className}>
				<SiteSection accent="2">
					<section className={css.hero}>
						<img alt="Cute animated getting ready image" src={gettingStarted} className={css.image} />
						<div className={css.content}>
							<h1>Developer Documentation</h1>
							<p>Documentation for Enact falls into several categories:  Tutorials, Libraries (API) Documentation, Developer Guides and Tools.</p>
						</div>
					</section>
				</SiteSection>

				<SiteSection>
					<LinkBox
						iconAlt="Icon of a magnifying glass looking at the cover of a book"
						iconSrc={tutorials}
						title="Tutorials"
					>
						{tutorialsList.map((edge, index) =>
							<CellLink key={index} to={edge.node.fields.slug} size="100%">{edge.node.frontmatter.title}</CellLink>
						)}
					</LinkBox>

					<hr />

					<LinkBox
						iconAlt="Icon of a stack of building blocks"
						iconSrc={modules}
						title="Libraries"
					>
						{modulesList.map((page, index) =>
							<CellLink key={index} to={page.path}>{page.title}</CellLink>
						)}
					</LinkBox>

					<hr />

					<LinkBox
						iconAlt="Icon of a placemark pinpointing a spot in an open book"
						iconSrc={guide}
						title="Developer Guide"
					>
						{guidesList.map((edge, index) =>
							<CellLink key={index} to={edge.node.fields.slug}>{edge.node.frontmatter.title}</CellLink>
						)}
					</LinkBox>

					<hr />

					<LinkBox
						iconAlt="Icon of a book being worked on with a wrench"
						iconSrc={devTools}
						title="Developer Tools"
					>
						{toolsList.map((edge, index) =>
							<CellLink key={index} to={edge.node.fields.slug}>{edge.node.frontmatter.title}</CellLink>
						)}
					</LinkBox>
				</SiteSection>
			</div>
		</SiteTitle>);
	}
});

export const pageQuery = graphql`
	query mardownQuery {
		guidesList: allMarkdownRemark(
			filter:{
				fields:{
					slug: {regex: "/docs\\/developer-guide\\/[^/]*\/$/"}
				}
			},
			sort: {
				fields: [frontmatter___order, frontmatter___title], order: ASC
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
			},
			sort: {
				fields: [frontmatter___order, frontmatter___title], order: ASC
			}
		) {
			...pageFields
		}
		tutorialsList: allMarkdownRemark(
			filter:{
				fields:{
					slug: {regex: "/docs\\/tutorials\\/[^/]*\/$/"}
				}
			},
			sort: {
				fields: [frontmatter___order, frontmatter___title], order: ASC
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
