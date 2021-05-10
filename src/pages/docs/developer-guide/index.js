import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import {Row} from '@enact/ui/Layout';

import {CellLink} from '../../../components/LinkBox';
import Page from '../../../components/DocsPage';
import SiteTitle from '../../../components/SiteTitle';
import SiteSection from '../../../components/SiteSection';

import css from '../../../css/main.module.less';

// images
import guide from '../images/guide.svg';

export const frontmatter = {
	title: 'Developer Guide',
	description: 'Enact Framework Developer Guide'
};

const Doc = class ReduxDocList extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render () {
		const componentDocs = this.props.data.guidesList.edges;

		return (
			<Page location={this.props.location}>
				<SiteTitle {...this.props} title={frontmatter.title}>
					<SiteSection className="covertLinks">
						<Helmet>
							<meta name="description" content={frontmatter.description} />
						</Helmet>
						<h1 className={css.withCaption}><img alt="Location marked in a book" src={guide} />{frontmatter.title}</h1>
						<div className={css.caption}>
							<p>Details and resources on how to use Enact.</p>
						</div>
						<Row wrap>
							{componentDocs.map((page) => {
								const slug = page.node.fields.slug;
								const title = page.node.frontmatter.title ||
									slug.replace('/docs/developer-guide/', '').replace('_', ' ');
								return (
									<CellLink key={slug} to={slug}>{title}</CellLink>
								);
							})}
						</Row>
					</SiteSection>
				</SiteTitle>
			</Page>
		);
	}
};

export const devGuideQuery = graphql`
	query devGuideQuery {
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
	}
`;

export default Doc;
