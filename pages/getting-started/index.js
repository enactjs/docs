import React from 'react';
// import DocumentTitle from 'react-document-title';
import {prefixLink} from 'gatsby-helpers';
import {Link} from 'react-router';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';

import Page from '../../components/Page';
import SiteSection from '../../components/SiteSection';

import css from './index.less';

const LinkBox = kind({
	name: 'LinkBox',
	propTypes: {
		children: React.PropTypes.node,
		iconAlt: React.PropTypes.string,
		iconSrc: React.PropTypes.string,
		title: React.PropTypes.string
	},
	render: ({children, iconAlt, iconSrc, title, ...rest}) => (
		<Row align="center" component="section" className={css.linkBox} {...rest}>
			<Cell size={200} className={css.image} shrink>
				<img alt={iconAlt} src={iconSrc} /><br />
				{title}
			</Cell>
			<Cell>
				<Row wrap className={css.content}>
					{children}
				</Row>
			</Cell>
		</Row>
	)
});

const CellLink = kind({
	name: 'CellLink',
	propTypes: {
		children: React.PropTypes.string,
		to: React.PropTypes.string
	},
	render: ({to, children, ...rest}) => (
		<Cell size="35%" className={css.cell} component={Link} to={prefixLink(to)} {...rest}>{children}</Cell>
	)
});

const tidyTitle = (page, basePath) => {
	if (page.data.title) return page.data.title;

	const path = page.path.replace(basePath, '');
	const parts = path.split('/');
	return parts[0].replace('/', '').replace('_', ' ');
};

const IndexBase = kind({
	name: 'Home',
	// propTypes: {
	// 	cellSize: React.PropTypes.string
	// },
	// defaultProps: {
	// 	cellSize: '35%'
	// },
	styles: {
		css,
		className: 'gettingStarted'
	},
	computed: {
		guidesList: ({route}) => route.pages.filter(
			(page) =>
				page.path.includes('/docs/developer-guide/') &&
				(page.path.length > route.page.path.length) &&
				page.path.split('/').length === 5
		),
		// modulesList: ({route}) => route.pages.filter(
		// 	(page) =>
		// 		page.path.includes('/docs/modules/') &&
		// 		page.path.split('/').length === 5
		// ),
		toolsList: ({route}) => route.pages.filter(
			(page) =>
				page.path.includes('/docs/developer-tools/') &&
				(page.path.length > route.page.path.length) &&
				page.path.split('/').length === 5
		),
		tutorialsList: ({route}) => route.pages.filter(
			(page) =>
				page.path.includes('/docs/tutorials/') &&
				(page.path.length > route.page.path.length) &&
				page.path.split('/').length === 5
		)
	},
	render: ({guidesList, toolsList, tutorialsList, ...rest}) => {
		return (<Page {...rest} manualLayout>
			<SiteSection accent="2">
				<Row align="center" component="section" className={css.hero}>
					<Cell size={100} className={css.image} shrink>
						<img alt="Cute animated getting ready image" src="images/getting-started.svg" /><br />
					</Cell>
					<Cell size="70%" className={css.content}>
						<h1>Developer Documentation</h1>
						<p>Enact is a framework designed to be performant, customizable and well structured.</p>
					</Cell>
				</Row>
			</SiteSection>

			<SiteSection>
				<LinkBox
					iconAlt="Icon of a magnafying glass looking at the cover of a book"
					iconSrc="images/tutorials.svg"
					title="Tutorials"
				>
					{tutorialsList.map((page, index) =>
						<CellLink key={index} to={page.path}>{tidyTitle(page, '/docs/tutorials/')}</CellLink>
					)}
				</LinkBox>

				<hr />

				<LinkBox
					iconAlt="Icon of a stack of building blocks"
					iconSrc="images/modules.svg"
					title="Modules"
				>
					<CellLink to="/docs/modules/">Core</CellLink>
					<CellLink to="/docs/modules/">i18n</CellLink>
					<CellLink to="/docs/modules/">moonstone</CellLink>
					<CellLink to="/docs/modules/">spotlight</CellLink>
					<CellLink to="/docs/modules/">ui</CellLink>
					<CellLink to="/docs/modules/">webos</CellLink>
				</LinkBox>

				<hr />

				<LinkBox
					iconAlt="Icon of a placemark pinpointing a spot in an open book"
					iconSrc="images/guide.svg"
					title="Developer Guide"
				>
					{guidesList.map((page, index) =>
						<CellLink key={index} to={page.path}>{tidyTitle(page, '/docs/developer-guide/')}</CellLink>
					)}
				</LinkBox>

				<hr />

				<LinkBox
					iconAlt="Icon of a book being worked on with a wrench"
					iconSrc="images/devtools.svg"
					title="Developer Tools"
				>
					{toolsList.map((page, index) =>
						<CellLink key={index} to={page.path}>{tidyTitle(page, '/docs/developer-tools/')}</CellLink>
					)}
				</LinkBox>
			</SiteSection>
		</Page>
		);
	}
});

export default IndexBase;
