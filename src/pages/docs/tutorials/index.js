import React from 'react';
import DocumentTitle from 'react-document-title';
import {config} from '../../../config';
import {Column, Row} from '@enact/ui/Layout';
import {CellLink} from '../../../components/LinkBox';

import css from '../../../css/main.less';

export const frontmatter = {
	title: 'Tutorials'
};

const Doc = class ReduxDocList extends React.Component {
	render () {
		const componentDocs = this.props.data.tutorialsList.edges;

		return (
			<DocumentTitle title={config.siteTitle}>
				<div className="covertLinks">
					<h1 className={css.withCaption}><img alt="Look in a book" src="../images/tutorials.svg" />{config.siteTitle}</h1>
					<div className={css.caption}>
						<p>Here you can learn the basics of Enact. Enact is a JavaScript
						framework built around the React UI library. You may have heard some things about
						React and how difficult it can be to learn. Don&apos;t panic. Part of the point of the Enact
						framework is to reduce the complexity by simplifying, and making easier, many of the rough bits
						of React and its steep learning curve involve. Basically, we did the hard part,
						made many evaluations and wrote solutions, so you don&apos;t have to.</p>

						<p>As you follow along, we&apos;ll slowly introduce the new concepts that you will
						need to learn to master Enact. These new concepts include some React-specific
						knowledge, new JavaScript features you can take advantage of, and an
						introduction to the tools Enact provides.</p>

						<p>Try these step-by-step hands-on tutorials and sample projects to help you
						learn how to use the Enact framework:</p>
					</div>
					<Column wrap>
						{componentDocs.map((page, index) => {
							const path = page.node.fields.slug.replace(this.props.location.pathname, '');
							const parts = path.split('/');
							if (parts.length > 2) {
								return '';
							}
							const title = page.node.frontmatter.title ||
								parts[0].replace('/', '').replace('_', ' ');
							return (
								<CellLink key={index} to={page.node.fields.slug}>{title}</CellLink>
							);
						})}
					</Column>
				</div>
			</DocumentTitle>
		);
	}
};

export const tutorialsQuery = graphql`
	query tutorialsQuery {
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
`;

export default Doc;
