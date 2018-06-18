import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import React from 'react';
import {Row} from '@enact/ui/Layout';

import {CellLink} from '../../../components/LinkBox';
import {config} from '../../../config';

import css from '../../../css/main.less';

// images
import guide from '../images/guide.svg';

export const frontmatter = {
	title: 'Developer Guide'
};

const Doc = class ReduxDocList extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render () {
		const componentDocs = this.props.data.guidesList.edges;

		return (
			<DocumentTitle title={config.siteTitle}>
				<div className="covertLinks">
					<h1 className={css.withCaption}><img alt="Location marked in a book" src={guide} />{config.siteTitle}</h1>
					<div className={css.caption}>
						<p>Details and resources on how to use Enact.</p>
					</div>
					<Row wrap>
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
					</Row>
				</div>
			</DocumentTitle>
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
			}
		) {
			...pageFields
		}
	}
`;

export default Doc;
