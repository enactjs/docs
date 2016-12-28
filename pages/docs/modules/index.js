import React from 'react';
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router';
import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';

export default class DocList extends React.Component {

	static metadata () {
		return {
			title: 'Modules'
		};
	}

	render () {
		const componentDocs = this.props.route.pages.filter((page) =>
			page.path.includes('/docs/modules/'));
		let lastLibrary;

		return (
			<DocumentTitle title={`${DocList.metadata().title} | ${config.siteTitle}`}>
				<div>
					<h1>Modules by Library</h1>
					{componentDocs.map((page, index ) => {
						const linkText = page.path.replace('/docs/modules/', '').replace(/\/$/, '');
						const library = linkText.split('/')[0];
						let header = null;

						if (linkText === '') {	// Don't link back to /docs/modules
							return null;
						}

						if (library !== lastLibrary) {
							header = <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '5px', marginTop: '15px'}}>{library} Library</div>;
							lastLibrary = library;
						}

						return (
							<div key={index}>
								{header}
								<Link to={prefixLink(page.path)}>{linkText}</Link>
							</div>
						);
					})}
				</div>
			</DocumentTitle>
		);
	}
}

// For reasons that I can't explain, using a const with this value and sharing with above does not work!
exports.data = {
	title: 'Modules'
};
