import React from 'react';
import DocumentTitle from 'react-document-title';
import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';
import {Row} from '@enact/ui/Layout';

import GridItem from '../../../components/GridItem';

import css from '../../../css/main.less';

const metadata = {
	title: 'Module Libraries'
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
					<h1>Module Libraries</h1>
					<div>
						<p>Closer look at Enact libraries and components.</p>
					</div>
					<Row wrap>
						{componentDocs.map((section, index) => {
							const linkText = section.path.replace('/docs/modules/', '').replace(/\/$/, '');
							const library = linkText.split('/')[0];
							if (library && library !== lastLibrary) {
								// console.log('section:', section);
								lastLibrary = library;
								return (
									<GridItem key={index} to={prefixLink(section.path)} description="Hey look at me, I'm a component library. This is where some cool stuff is. Is this description over yet?">
										{library + ' Library'}
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
	title: 'Module Libraries'
};

export default Doc;
