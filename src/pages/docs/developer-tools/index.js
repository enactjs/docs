import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';
import PropTypes from 'prop-types';
import { Component } from 'react';
import {Row} from '@enact/ui/Layout';

import {CellLink} from '../../../components/LinkBox';
import Page from '../../../components/DocsPage';
import SiteTitle from '../../../components/SiteTitle';
import SiteSection from '../../../components/SiteSection';

import css from '../../../css/main.module.less';

// images
import devTools from '../images/devtools.svg';

export const frontmatter = {
	title: 'Developer Tools',
	description: 'Developer tools and related packages'
};

const Doc = class ReduxDocList extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render () {
		const componentDocs = this.props.data.toolsList.edges;

		return (
			<Page {...this.props}>
				<SiteTitle {...this.props} title={frontmatter.title}>
					<SiteSection className={css.moduleBody + ' covertLinks'}>
						<Helmet>
							<meta name="description" content={frontmatter.description} />
						</Helmet>
						<h1 className={css.withCaption}><img alt="A wrench fixing a book" src={devTools} />{frontmatter.title}</h1>
						<div className={css.caption}>
							<p>Enact tools that make life easier.</p>
						</div>
						<Row wrap>
							{componentDocs.map((page) => {
								const slug = page.node.fields.slug;
								const title = page.node.frontmatter.title ||
									slug.replace('/docs/developer-tools/', '').replace('_', ' ');
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

export const devToolsQuery = graphql`
	query devToolsQuery {
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
	}
`;

export default Doc;
