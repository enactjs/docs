import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import React from 'react';
import {Row} from '@enact/ui/Layout';

import {config} from '../../../config';
import {CellLink} from '../../../components/LinkBox';

import css from '../../../css/main.less';

// images
import devTools from '../images/devtools.svg';

export const frontmatter = {
	title: 'Developer Tools'
};

const Doc = class ReduxDocList extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render () {
		const componentDocs = this.props.data.toolsList.edges;

		return (
			<DocumentTitle title={config.siteTitle}>
				<div className={css.moduleBody + ' covertLinks'}>
					<h1 className={css.withCaption}><img alt="A wrench fixing a book" src={devTools} />{config.siteTitle}</h1>
					<div className={css.caption}>
						<p>Enact tools that make life easier.</p>
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

export const devToolsQuery = graphql`
	query devToolsQuery {
		toolsList: allMarkdownRemark(
			filter:{
				fields:{
					slug: {regex: "/docs\\/developer-tools\\/[^/]*\/$/"}
				}
			}
		) {
			...pageFields
		}
	}
`;

export default Doc;
