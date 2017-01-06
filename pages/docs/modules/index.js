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
				<article className="libraryList">
					<h1>Modules by Library</h1>
					{componentDocs.map((page, index) => {
						const linkText = page.path.replace('/docs/modules/', '').replace(/\/$/, '');
						const library = linkText.split('/')[0];
						if (library && library !== lastLibrary) {
							lastLibrary = library;
							return (
								<section key={index}>
									<h2>{library} Library</h2>
									<ul>{componentDocs.map((page, linkIndex) => {
										// Compartmentalize <li>s inside the parent UL
										const subLinkText = page.path.replace('/docs/modules/', '').replace(/\/$/, '');
										const subLibrary = subLinkText.split('/')[0];
										if (subLibrary === library) {
											return (
												<li key={linkIndex}>
													<Link to={prefixLink(page.path)}>{subLinkText}</Link>
												</li>
											);
										}
									})}</ul>
								</section>
							);
						}
					})}
				</article>
			</DocumentTitle>
		);
	}
}

// For reasons that I can't explain, using a const with this value and sharing with above does not work!
exports.data = {
	title: 'Modules'
};
