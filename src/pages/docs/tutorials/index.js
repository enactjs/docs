import {Column} from '@enact/ui/Layout';
import {Helmet} from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';

import {CellLink} from '../../../components/LinkBox';
import SiteSection from '../../../components/SiteSection';
import SiteTitle from '../../../components/SiteTitle';

import css from '../../../css/main.module.less';

// images
import tutorials from '../images/tutorials.svg';

export const frontmatter = {
	title: 'Tutorials',
	description: 'Learn Enact by following these Tutorials'
};

const Doc = class ReduxDocList extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render () {
		const componentDocs = this.props.data.tutorialsList.edges;
		return (
			<SiteTitle {...this.props} title={frontmatter.title}>
				<SiteSection className="covertLinks">
					<Helmet>
						<meta name="description" content={frontmatter.description} />
					</Helmet>
					<h1 className={css.withCaption}><img alt="Look in a book" src={tutorials} />{frontmatter.title}</h1>
					<div className={css.caption}>
						<p>Here you can learn the basics of Enact. Enact is a JavaScript
						framework built around the React UI library. You may have heard some things about
						React and how difficult it can be to learn. Don&rsquo;t panic. Part of the point of the Enact
						framework is to reduce the complexity by simplifying, and making easier, many of the rough bits
						of React and its steep learning curve involve. Basically, we did the hard part,
						made many evaluations and wrote solutions, so you don&rsquo;t have to.</p>

						<p>As you follow along, we&rsquo;ll slowly introduce the new concepts that you will
						need to learn to master Enact. These new concepts include some React-specific
						knowledge, new JavaScript features you can take advantage of, and an
						introduction to the tools Enact provides.</p>

						<p>Try these step-by-step hands-on tutorials and sample projects to help you
						learn how to use the Enact framework:</p>
					</div>
					<Column wrap>
						{componentDocs.map((page) => {
							const slug = page.node.fields.slug;
							const title = page.node.frontmatter.title ||
								slug.replace('/docs/tutorials/', '').replace('_', ' ');
							return (
								<CellLink key={slug} to={slug}>{title}</CellLink>
							);
						})}
					</Column>
				</SiteSection>
			</SiteTitle>
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
			},
			sort: {
				fields: [frontmatter___order, frontmatter___title], order: ASC
			}
		) {
			...pageFields
		}
	}
`;

export default Doc;
