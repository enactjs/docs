import React from 'react';
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router';
import {config} from 'config';

export default class ReduxDocList extends React.Component {
	static metadata () {
		return {
			title: 'Developer Guide'
		};
	}

	render () {
		const componentDocs = this.props.route.pages.filter((page) =>
			page.path.includes('/docs/developer-guide/') && (page.path.length > this.props.route.path.length));

		return (
			<DocumentTitle title={`${ReduxDocList.metadata().title} | ${config.siteTitle}`}>
				<div>
					<h1>{ReduxDocList.metadata().title}</h1>
					{componentDocs.map((page, index) => {
						const path = page.path.replace(this.props.route.path, '');
						const parts = path.split('/');
						if (parts.length > 2) {
							return '';
						}
						const title = page.data.title ||
							parts[0].replace('/', '').replace('_', ' ');
						return (
							<div key={index}>
								<Link key={index} to={page.path}>{title}</Link>
							</div>
						);
					})}
				</div>
			</DocumentTitle>
		);
	}
}
