import PropTypes from 'prop-types';
import React from 'react';
import DocumentTitle from 'react-document-title';

import {config} from '../../../config';
import {Row} from '@enact/ui/Layout';
import GridItem from '../../../components/GridItem';

import libraryDescription from '../../../data/libraryDescription.json';

import css from '../../../css/main.less';
import componentCss from './index.less';

// images
import modules from '../images/modules.svg';
// package images
import core from '../images/package-core.svg';
import i18n from '../images/package-i18n.svg';
import moonstone from '../images/package-moonstone.svg';
import spotlight from '../images/package-spotlight.svg';
import ui from '../images/package-ui.svg';
import webos from '../images/package-webos.svg';
const packageImages = {
	core,
	i18n,
	moonstone,
	spotlight,
	ui,
	webos
};

export const frontmatter = {
	title: 'API Libraries'
};

const Doc = class ReduxDocList extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired
	};

	render () {
		const {data} = this.props;
		// TODO: pre-filter
		const componentDocs = data.modulesList.edges.filter((page) =>
			page.node.fields.slug.includes('/docs/modules/'));
		let lastLibrary;

		return (
			<DocumentTitle title={config.siteTitle}>
				<article className={css.libraryList + ' covertLinks'}>
					<h1 className={css.withCaption}><img alt="Building blocks" src={modules} />API Libraries</h1>
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
										<img className={componentCss.image} src={packageImages[library]} />
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
