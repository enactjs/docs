import React from 'react';
import DocumentTitle from 'react-document-title';
import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';
import {Row} from '@enact/ui/Layout';

import GridItem from '../../../components/GridItem';

import css from '../../../css/main.less';
import componentCss from './index.less';
import libraryDescription from '../../../data/libraryDescription.json';

const metadata = {
	title: 'API Libraries'
};

const Doc = class ReduxDocList extends React.Component {
	render () {
		const {route, ...rest} = this.props;
		const componentDocs = route.pages.filter((page) =>
			page.path.includes('/docs/modules/'));
		let lastLibrary;

		return (
			<DocumentTitle title={`${metadata.title} | ${config.siteTitle}`}>
				<article className={css.libraryList + ' covertLinks'}>
					<h1 className={css.withCaption}><img alt="Building blocks" src="../images/modules.svg" />API Libraries</h1>
					<div className={css.caption}>
						<p>Select a library to explore the Enact API</p>
					</div>
					<Row wrap style={{margin: '0 3em'}}>
						{componentDocs.map((section, index) => {
							const linkText = section.path.replace('/docs/modules/', '').replace(/\/$/, '');
							const library = linkText.split('/')[0];
							if (library && library !== lastLibrary) {
								lastLibrary = library;
								return (
									<GridItem className={componentCss.gridItem} key={index} to={prefixLink(section.path)} description={libraryDescription[library]} style={{marginBottom: '1em'}}>
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

// For reasons that I can't explain, using a const with this value and sharing with above does not work!
Doc.data = {
	title: 'API Libraries'
};

export default Doc;
