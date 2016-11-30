import React from 'react';
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router';
import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';

export default class DocList extends React.Component {

	static metadata () {
		return {
			title: 'Components'
		};
	}

	render () {
		const componentDocs = this.props.route.pages.filter((page) =>
			page.path.includes('/docs/components/modules/'));

		return (
			<DocumentTitle title={`${DocList.metadata().title} | ${config.siteTitle}`}>
				<div>
					<h1>Components</h1>
					{componentDocs.map((page, index ) => {
						const linkText = page.path.replace('/docs/components/modules/', '').replace(/\/$/, "");;

						return (
							<div key={index}>
								<Link to={prefixLink(page.path)}>{linkText}</Link>
							</div>
						);
					})}
				</div>
			</DocumentTitle>
		);
	}
}
