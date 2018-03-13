import React from 'react';
import DocumentTitle from 'react-document-title';
import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';

import {linkIsParentOf, sitePrefixMatchRegexp} from '../../utils/paths.js';
import {LinkBox, CellLink} from '../../components/LinkBox';
import Page from '../../components/Page';
import SiteSection from '../../components/SiteSection';

import css from './index.less';

const metadata = {
	title: 'Getting Started'
};

const tidyTitle = (page, basePath) => {
	if (page.data.title) return page.data.title;

	const path = page.path.replace(basePath, '');
	const parts = path.split('/');
	return parts[0].replace('/', '').replace('_', ' ');
};

const prunePathDepth = (path, depth) => {
	// remove the site prefix, remove the leading and trailing slashes for a more consistent split-array on the following line.
	const relativePath = path.replace(sitePrefixMatchRegexp, '').replace(/(^\/|\/$)/g, '');
	return (relativePath.split('/').length === depth);
};

const IndexBase = kind({
	name: 'GettingStarted',
	styles: {
		css,
		className: 'gettingStarted covertLinks'
	},
	computed: {
		guidesList: ({route}) => route.pages.filter(
			(page) =>
				linkIsParentOf('/docs/developer-guide/', page.path) &&
				prunePathDepth(page.path, 3)
		),
		modulesList: ({route}) => {
			const modules = route.pages.filter(
				(page) => linkIsParentOf('/docs/modules/', page.path)
			);
			const libraries = [];
			let lastLibrary;
			modules.map((mod) => {
				const linkText = mod.path.replace('/docs/modules/', '').replace(/\/$/, '');
				const library = linkText.split('/')[0];
				if (library && library !== lastLibrary) {
					// console.log('library:', library, lastLibrary);
					lastLibrary = library;
					libraries.push({title: library, path: mod.path});
				}
			});
			return libraries;
		},
		toolsList: ({route}) => route.pages.filter(
			(page) =>
				linkIsParentOf('/docs/developer-tools/', page.path) &&
				prunePathDepth(page.path, 3)
		),
		tutorialsList: ({route}) => route.pages.filter(
			(page) =>
				linkIsParentOf('/docs/tutorials/', page.path) &&
				prunePathDepth(page.path, 3)
		)
	},
	render: ({guidesList, modulesList, toolsList, tutorialsList, ...rest}) => {
		return (<DocumentTitle title={`${metadata.title} | ${config.siteTitle}`}>
			<Page {...rest} manualLayout>
				<SiteSection accent="2">
					<Row align="center" component="section" className={css.hero} wrap>
						<Cell size={100} className={css.image} shrink>
							<img alt="Cute animated getting ready image" src="images/getting-started.svg" /><br />
						</Cell>
						<Cell size="70%" className={css.content}>
							<h1>Developer Documentation</h1>
							<p>Documentation for Enact falls into several categories:  Tutorials, Libraries (API) Documentation, Developer Guides and Tools.</p>
						</Cell>
					</Row>
				</SiteSection>

				<SiteSection>
					<LinkBox
						childLayout="column"
						iconAlt="Icon of a magnifying glass looking at the cover of a book"
						iconSrc="images/tutorials.svg"
						title="Tutorials"
					>
						{tutorialsList.map((page, index) =>
							<CellLink key={index} to={prefixLink(page.path)}>{tidyTitle(page, '/docs/tutorials/')}</CellLink>
						)}
					</LinkBox>

					<hr />

					<LinkBox
						iconAlt="Icon of a stack of building blocks"
						iconSrc="images/modules.svg"
						title="Libraries"
					>
						{modulesList.map((page, index) =>
							<CellLink key={index} to={prefixLink(page.path)}>{page.title}</CellLink>
						)}
					</LinkBox>

					<hr />

					<LinkBox
						iconAlt="Icon of a placemark pinpointing a spot in an open book"
						iconSrc="images/guide.svg"
						title="Developer Guide"
					>
						{guidesList.map((page, index) =>
							<CellLink key={index} to={prefixLink(page.path)}>{tidyTitle(page, '/docs/developer-guide/')}</CellLink>
						)}
					</LinkBox>

					<hr />

					<LinkBox
						iconAlt="Icon of a book being worked on with a wrench"
						iconSrc="images/devtools.svg"
						title="Developer Tools"
					>
						{toolsList.map((page, index) =>
							<CellLink key={index} to={prefixLink(page.path)}>{tidyTitle(page, '/docs/developer-tools/')}</CellLink>
						)}
					</LinkBox>
				</SiteSection>
			</Page>
		</DocumentTitle>);
	}
});

IndexBase.data = {
	title: 'Getting Started'
};

export default IndexBase;
