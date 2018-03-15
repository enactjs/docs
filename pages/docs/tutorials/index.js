import React from 'react';
import DocumentTitle from 'react-document-title';
import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';
import {Column, Row} from '@enact/ui/Layout';
import {CellLink} from '../../../components/LinkBox';

import css from '../../../css/main.less';

const metadata = {
	title: 'Tutorials'
};

const Doc = class ReduxDocList extends React.Component {
	render () {
		const componentDocs = this.props.route.pages.filter((page) =>
			page.path.includes('/docs/tutorials/') && (page.path.length > this.props.route.page.path.length));

		return (
			<DocumentTitle title={`${metadata.title} | ${config.siteTitle}`}>
				<div className="covertLinks">
					<h1 className={css.withCaption}><img alt="Look in a book" src="../images/tutorials.svg" />{metadata.title}</h1>
					<div className={css.caption}>
						<p>Here you can learn the basics of Enact. Enact is a JavaScript
						framework built around the React UI library. You may have heard some things about
						React and how difficult it can be to learn. Don&apos;t panic. Part of the point of the Enact
						framework is to reduce the complexity by simplifying, and making easier, many of the rough bits
						of React and its steep learning curve involve. Basically, we did the hard part,
						made many evaluations and wrote solutions, so you don&apos;t have to.</p>

						<p>As you follow along, we&apos;ll slowly introduce the new concepts that you will
						need to learn to master Enact. These new concepts include some React-specific
						knowledge, new JavaScript features you can take advantage of, and an
						introduction to the tools Enact provides.</p>

						<p>Try these step-by-step hands-on tutorials and sample projects to help you
						learn how to use the Enact framework:</p>
					</div>
					<Column wrap>
						{componentDocs.map((page, index) => {
							const path = page.path.replace(this.props.route.page.path, '');
							const parts = path.split('/');
							if (parts.length > 2) {
								return '';
							}
							const title = page.data.title ||
							parts[0].replace('/', '').replace('_', ' ');
							return (
								<CellLink key={index} to={prefixLink(page.path)}>{title}</CellLink>
							);
						})}
					</Column>
				</div>
			</DocumentTitle>
		);
	}
};

// For reasons that I can't explain, using a const with this value and sharing with above does not work!
Doc.data = {
	title: 'Tutorials'
};

export default Doc;
