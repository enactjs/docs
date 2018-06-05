import React from 'react';
import DocumentTitle from 'react-document-title';
import {config} from '../../../config';
import {Row} from '@enact/ui/Layout';

import GridItem from '../../../components/GridItem';

import css from '../../../css/main.less';
import componentCss from './index.less';
import libraryDescription from '../../../data/libraryDescription.json';

export const frontmatter = {
	title: 'API Libraries'
};

const Doc = class ReduxDocList extends React.Component {
	render () {
		const {data, ...rest} = this.props;
		// TODO: pre-filter
		const componentDocs = data.modulesList.edges.filter((page) =>
			page.node.fields.slug.includes('/docs/modules/'));
		let lastLibrary;

		return (
			<DocumentTitle title={config.siteTitle}>
				<article className={css.libraryList + ' covertLinks'}>
					<h1 className={css.withCaption}><img alt="Building blocks" src="../images/modules.svg" />API Libraries</h1>
					<div className={css.caption}>
						<p>Select a library to explore the Enact API</p>
					</div>
					<Row wrap style={{margin: '0 3em'}}>
						{componentDocs.map((section, index) => {
							const linkText = section.node.fields.slug.replace('/docs/modules/', '').replace(/\/$/, '');
							const library = linkText.split('/')[0];
							if (library && library !== lastLibrary) {
								lastLibrary = library;
								return (
									<GridItem className={componentCss.gridItem} key={index} to={section.node.fields.slug} description={libraryDescription[library]} style={{marginBottom: '1em'}}>
										<img className={componentCss.image} src={'../images/package-' + library + '.svg'} />
										<strong>{library}</strong> Library
									</GridItem>
								);
							}
						})}
					</Row>
				</article>
			</DocumentTitle>
		);
	}
};

export const jsonQuery = graphql`
	query modulesDoc {
		modulesList: allJsonDoc(
			sort: {fields: [fields___slug], order: ASC}
		) {
			edges {
				node {
					fields {
						slug
					}
				}
			}
		}
	}
`;
export default Doc;
