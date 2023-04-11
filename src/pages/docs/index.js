import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';
import {StaticImage as Image} from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Layout, Row} from "@enact/ui/Layout";

import CellLink from '../../components/CellLink';
import Page from '../../components/Page';
import SiteSection from '../../components/SiteSection';
import SiteTitle from '../../components/SiteTitle';

import css from './index.module.less';

export const frontmatter = {
	title: 'Getting Started',
	description: 'Enact Developer Guide Table of Contents'
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

	render: ({className, guidesList, location, modulesList, toolsList, tutorialsList, ...rest}) => {
		return (<Page location={location}>
			<SiteTitle {...rest} title={frontmatter.title}>
				<div className={className}>
					<Helmet>
						<meta name="description" content={frontmatter.description} />
					</Helmet>
					<SiteSection accent="2">
						<section className={css.hero}>
							<Image alt="A rocket ship, get ready for take-off!" className={css.image} loading="eager" placeholder="none" src="./images/getting-started.svg" />
							<div className={css.content}>
								<h1>Developer Documentation</h1>
								<p>Documentation for Enact falls into several categories:  Tutorials, Libraries (API) Documentation, Developer Guides and Tools.</p>
							</div>
						</section>
					</SiteSection>

					<SiteSection>
						<Row align="center" component="section" className={css.linkBox}>
							<div className={css.imageContainer}>
								<Image alt="Icon of a magnifying glass looking at the cover of a book" className={css.image} loading="eager" placeholder="none" src="./images/tutorials.svg" /><br />
								Tutorials
							</div>
							<div className={css.contentCell}>
								<Layout wrap className={css.content}>
									{tutorialsList.map((edge, index) =>
										<CellLink key={index} to={edge.node.fields.slug} size="100%">{edge.node.frontmatter.title}</CellLink>
									)}
								</Layout>
							</div>
						</Row>

						<hr />

						<Row align="center" component="section" className={css.linkBox}>
							<div className={css.imageContainer}>
								<Image alt="Icon of a stack of building blocks" className={css.image} loading="eager" placeholder="none" src="./images/modules.svg" /><br />
								Libraries
							</div>
							<div className={css.contentCell}>
								<Layout wrap className={css.content}>
									{modulesList.map((page, index) =>
										<CellLink key={index} to={page.path}>{page.title}</CellLink>
									)}
								</Layout>
							</div>
						</Row>

						<hr />

						<Row align="center" component="section" className={css.linkBox}>
							<div className={css.imageContainer}>
								<Image alt="Icon of a placemark pinpointing a spot in an open book" className={css.image} loading="eager" placeholder="none" src="./images/guide.svg" /><br />
								Developer Guide
							</div>
							<div className={css.contentCell}>
								<Layout wrap className={css.content}>
									{guidesList.map((edge, index) =>
										<CellLink key={index} to={edge.node.fields.slug}>{edge.node.frontmatter.title}</CellLink>
									)}
								</Layout>
							</div>
						</Row>

						<hr />

						<Row align="center" component="section" className={css.linkBox}>
							<div className={css.imageContainer}>
								<Image alt="Icon of a book being worked on with a wrench" className={css.image} loading="eager" placeholder="none" src="./images/devtools.svg" /><br />
								Developer Tools
							</div>
							<div className={css.contentCell}>
								<Layout wrap className={css.content}>
									{toolsList.map((edge, index) =>
										<CellLink key={index} to={edge.node.fields.slug}>{edge.node.frontmatter.title}</CellLink>
									)}
								</Layout>
							</div>
						</Row>
					</SiteSection>
				</div>
			</SiteTitle>
		</Page>);
	}
});

export const pageQuery = graphql`
	query mardownQuery {
		guidesList: allMarkdownRemark(
			filter: {fields: {slug: {regex: "/docs\\/developer-guide\\/[^/]*/$/"}}},
			sort: [{frontmatter: {order: ASC}}, {frontmatter: {title: ASC}}]
		) {
			...pageFields
		}
		modulesList: allJsonDoc(sort: {fields: {slug: ASC}}) {
			edges {
				node {
					fields {
						slug
					}
				}
			}
		}
		toolsList: allMarkdownRemark(
			filter: {fields: {slug: {regex: "/docs\\/developer-tools\\/[^/]*/$/"}}},
			sort: [{frontmatter: {order: ASC}}, {frontmatter: {title: ASC}}]
		) {
			...pageFields
		}
		tutorialsList: allMarkdownRemark(
			filter: {fields: {slug: {regex: "/docs\\/tutorials\\/[^/]*/$/"}}},
			sort: [{frontmatter: {order: ASC}}, {frontmatter: {title: ASC}}]
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
