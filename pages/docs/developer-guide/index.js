import React from 'react';
import DocumentTitle from 'react-document-title';
import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';
import {Row} from '@enact/ui/Layout';
import {CellLink} from '../../../components/LinkBox';

const metadata = {
	title: 'Developer Guide'
};

const Doc = class ReduxDocList extends React.Component {
	render () {
		const componentDocs = this.props.route.pages.filter((page) =>
			page.path.includes('/docs/developer-guide/') && (page.path.length > this.props.route.page.path.length));

		return (
			<DocumentTitle title={`${metadata.title} | ${config.siteTitle}`}>
				<div className="covertLinks">
					<h1>{metadata.title}</h1>
					<div>
						<p>Details and resources on how to use Enact.</p>
					</div>
					<Row wrap>
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
					</Row>
				</div>
			</DocumentTitle>
		);
	}
};

// For reasons that I can't explain, using a const with this value and sharing with above does not work!
Doc.data = {
	title: 'Developer Guide'
};

export default Doc;
